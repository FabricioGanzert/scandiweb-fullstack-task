<?php
namespace App\Controller;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;

use RuntimeException;
use Throwable;

class GraphQL {
    static public function handle() {
        try {
            // Define AttributeItem type for each attribute's item.
            $attributeItemType = new ObjectType([
                'name'   => 'AttributeItem',
                'fields' => [
                    'displayValue' => ['type' => Type::string()],
                    'value'        => ['type' => Type::string()],
                    'id'           => ['type' => Type::string()],
                    '__typename'   => ['type' => Type::string()],
                ]
            ]);

            // Define AttributeSet type for each attribute group.
            $attributeSetType = new ObjectType([
                'name'   => 'AttributeSet',
                'fields' => [
                    // We use the attribute's name as its id.
                    'id'         => ['type' => Type::string()],
                    'name'       => ['type' => Type::string()],
                    'type'       => ['type' => Type::string()],
                    'items'      => ['type' => Type::listOf($attributeItemType)],
                    '__typename' => ['type' => Type::string()],
                ]
            ]);

            // Define the Category type.
            $categoryType = new ObjectType([
                'name'   => 'Category',
                'fields' => [
                    'id'       => ['type' => Type::id()],
                    'name'     => ['type' => Type::string()],
                    'typename' => [
                        'type'    => Type::string(),
                        'resolve' => function ($category) {
                            return $category->__typename ?? null;
                        }
                    ],
                    'products' => [
                        'type'    => Type::listOf(new ObjectType([
                            'name'   => 'Product',
                            'fields' => [
                                'id'          => ['type' => Type::id()],
                                'name'        => ['type' => Type::string()],
                                'description' => ['type' => Type::string()],
                                'inStock'     => ['type' => Type::boolean()],
                                'brand'       => ['type' => Type::string()],
                                'prices'      => [
                                    'type'    => Type::listOf(new ObjectType([
                                        'name'   => 'Price',
                                        'fields' => [
                                            'amount' => ['type' => Type::float()],
                                            'currency' => [
                                                'type' => new ObjectType([
                                                    'name'   => 'Currency',
                                                    'fields' => [
                                                        'label'      => ['type' => Type::string()],
                                                        'symbol'     => ['type' => Type::string()],
                                                        '__typename' => ['type' => Type::string()],
                                                    ]
                                                ])
                                            ],
                                            '__typename' => ['type' => Type::string()],
                                        ]
                                    ])),
                                    'resolve' => function ($product) {
                                        return $product->prices();
                                    }
                                ],
                                'gallery' => [
                                    'type'    => Type::listOf(Type::string()),
                                    'resolve' => function ($product) {
                                        return $product->gallery();
                                    }
                                ],
                                'attributes' => [
                                    'type'    => Type::listOf($attributeSetType),
                                    'resolve' => function ($product) {
                                        // Get the list of Attribute model objects.
                                        $attributes = $product->attributes();
                                        // For each attribute, fetch its items and transform the structure.
                                        return array_map(function($attr) {
                                            // Call the items() method on the attribute object.
                                            $items = $attr->items(); // Expect an array of rows from attribute_items.
                                            $transformedItems = array_map(function($item) {
                                                return [
                                                    'displayValue' => isset($item['displayValue']) ? $item['displayValue'] : $item['value'],
                                                    'value'        => $item['value'],
                                                    'id'           => $item['id'],
                                                    '__typename'   => $item['__typename'] ?? 'Attribute'
                                                ];
                                            }, $items);
                                            
                                            return [
                                                'id'         => $attr->name, // using name as id per expected output
                                                'name'       => $attr->name,
                                                'type'       => $attr->type,
                                                'items'      => $transformedItems,
                                                '__typename' => 'AttributeSet'
                                            ];
                                        }, $attributes);
                                    }
                                ]
                            ]
                        ])),
                        'resolve' => function ($category) {
                            return $category->products();
                        }
                    ]
                ]
            ]);
            
            // Define the standalone Product type.
            $productType = new ObjectType([
                'name'   => 'Product',
                'fields' => [
                    'id'          => ['type' => Type::id()],
                    'name'        => ['type' => Type::string()],
                    'description' => ['type' => Type::string()],
                    'inStock'     => ['type' => Type::boolean()],
                    'brand'       => ['type' => Type::string()],
                    'prices'      => [
                        'type'    => Type::listOf(new ObjectType([
                            'name'   => 'Price',
                            'fields' => [
                                'amount' => ['type' => Type::float()],
                                'currency' => [
                                    'type' => new ObjectType([
                                        'name'   => 'Currency',
                                        'fields' => [
                                            'label'      => ['type' => Type::string()],
                                            'symbol'     => ['type' => Type::string()],
                                            '__typename' => ['type' => Type::string()],
                                        ]
                                    ])
                                ],
                                '__typename' => ['type' => Type::string()],
                            ]
                        ])),
                        'resolve' => function ($product) {
                            return $product->prices();
                        }
                    ],
                    'gallery' => [
                        'type'    => Type::listOf(Type::string()),
                        'resolve' => function ($product) {
                            return $product->gallery();
                        }
                    ],
                    'category'  => [
                        'type'    => $categoryType,
                        'resolve' => function ($product) {
                            return $product->category();
                        }
                    ],
                    'attributes' => [
                        'type'    => Type::listOf($attributeSetType),
                        'resolve' => function ($product) {
                            $attributes = $product->attributes();
                            return array_map(function($attr) {
                                $items = $attr->items();
                                $transformedItems = array_map(function($item) {
                                    return [
                                        'displayValue' => isset($item['displayValue']) ? $item['displayValue'] : $item['value'],
                                        'value'        => $item['value'],
                                        'id'           => $item['id'],
                                        '__typename'   => $item['__typename'] ?? 'Attribute'
                                    ];
                                }, $items);
                                
                                return [
                                    'id'         => $attr->name,
                                    'name'       => $attr->name,
                                    'type'       => $attr->type,
                                    'items'      => $transformedItems,
                                    '__typename' => 'AttributeSet'
                                ];
                            }, $attributes);
                        }
                    ]
                ]
            ]);
            
            // Define the Order type.
            $orderType = new ObjectType([
                'name'   => 'Order',
                'fields' => [
                    'id'           => ['type' => Type::id()],
                    'total_amount' => ['type' => Type::float()],
                    'created_at'   => ['type' => Type::string()],
                ]
            ]);

            // Mutation for inserting orders.
            $orderItemInputType = new InputObjectType([
                'name'   => 'OrderItemInput',
                'fields' => [
                    'product_id' => ['type' => Type::id()],
                    'quantity'   => ['type' => Type::int()],
                    'price'      => ['type' => Type::float()],
                ]
            ]);
            
            $orderInputType = new InputObjectType([
                'name'   => 'OrderInput',
                'fields' => [
                    'items' => ['type' => Type::listOf($orderItemInputType)]
                ]
            ]);           

            $orderItemType = new ObjectType([
                'name'   => 'OrderItem',
                'fields' => [
                    'id'         => Type::int(),
                    'product_id' => Type::string(),
                    'quantity'   => Type::int(),
                    'price'      => Type::float(),
                ],
            ]);
                        
            $orderSingleType = new ObjectType([
                'name'   => 'Order',
                'fields' => function () use ($orderItemType) {
                    return [
                        'id'           => Type::int(),
                        'total_amount' => Type::float(),
                        'created_at'   => Type::string(),
                        'items'        => [
                            'type'    => Type::listOf($orderItemType),
                            'resolve' => function ($order) {
                                return $order->orderItems(); // Fetch order items
                            },
                        ],
                    ];
                }
            ]);

            $mutationType = new ObjectType([
                'name'   => 'Mutation',
                'fields' => [
                    'createOrder' => [
                        'type' => $orderType,  // your defined Order output type
                        'args' => [
                            'order' => ['type' => $orderInputType],
                        ],
                        'resolve' => function ($root, $args) {
                            $orderData = $args['order'];
                            $order = new Order();

                            $order->create([
                                'total_amount' => array_sum(array_map(function ($item) {
                                    return $item['price'] * $item['quantity'];
                                }, $orderData['items'])),
                                'created_at' => date('Y-m-d H:i:s'),
                            ]);

                            foreach ($orderData['items'] as $item) {
                                $orderItem = new OrderItem();
                                $orderItem->create([
                                    'order_id'   => $order->id(),
                                    'product_id' => $item['product_id'],
                                    'quantity'   => $item['quantity'],
                                    'price'      => $item['price'],
                                ]);
                            }

                            // Fetch the order from the database to ensure all fields are set
                            return $order->findOrder($order->id());
                        }
                    ]
                ]
            ]);
            
            // Add the orders field to the Query type.
            $queryType = new ObjectType([
                'name'   => 'Query',
                'fields' => [
                    'categories' => [
                        'type'    => Type::listOf($categoryType),
                        'resolve' => function () {
                            return Category::allCategories();
                        }
                    ],
                    'product' => [
                        'type' => $productType,
                        'args' => [
                            'id' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function ($root, $args) {
                            $productModel = new \App\Models\Product();
                            return $productModel->findProduct($args['id']);
                        },
                    ],                  
                    'products' => [
                        'type'    => Type::listOf($productType),
                        'resolve' => function () {
                            return Product::allProducts();
                        }
                    ],
                    'order' => [
                        'type' => $orderSingleType,
                        'args' => [
                            'id' => Type::nonNull(Type::int()),
                        ],
                        'resolve' => function ($root, $args) {
                            $orderModel = new \App\Models\Order();
                            return $orderModel->findWithItems($args['id']);
                        },
                    ],                  
                    'orders' => [
                        'type' => Type::listOf($orderType),
                        'resolve' => function () {
                            $orderModel = new Order();
                            $orders = $orderModel->all();

                            if (is_object(reset($orders))) {
                                return array_map(function ($order) {
                                    return [
                                        'id' => $order->id,
                                        'total_amount' => $order->total_amount,
                                        'created_at' => $order->created_at,
                                    ];
                                }, $orders);
                            }

                            return $orders; // For associative array fetch
                        }
                    ]

                ],
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
                    ->setMutation($mutationType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }
            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;
            $rootValue = [];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray(true);
            header('Content-Type: application/json; charset=UTF-8');
            return json_encode($output);
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                    'trace'   => $e->getTraceAsString()
                ],
            ];
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($output);
        }
    }
}

?>
