const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`);

const Users = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, {
    tableName: 'users',
    timestamps: true,
});

const Categories = sequelize.define('Category', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'categories',
    timestamps: false,
});

const Products = sequelize.define('Product', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }, 
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }, 
    description: {
        type: DataTypes.TEXT,
    }, 
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Categories,
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
       type: DataTypes.DATE,
       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'products',
    timestamps: true,
});

const Orders = sequelize.define('Order', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }, 
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',      
        }
    }, 
    status: {
        type: DataTypes.ENUM,
        values: ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'],
        allowNull: false,
        defaultValue: 'NEW',
    },
    createdAt: {
       type: DataTypes.DATE,
       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'orders',
    timestamps: true,
});

const OrderItems = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Orders,
            key: 'id',
            onDelete: 'CASCADE',
        },
    }, 
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Products,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: false,
});

const Addresses = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, 
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    zip_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'addresses',
    timestamps: true,
});

const Reviews = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Products,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Rating must be greater than or equal to 1',
            },
            max: {
                args: [5],
                msg: 'Rating must be less than or equal to 5',
            },
        },
    }, 
    comment: {
        type: DataTypes.TEXT,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'reviews',
    timestamps: true,
});

const PaymentMethods = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    card_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    card_type: {
        type: DataTypes.ENUM,
        values: ['Visa', 'MasterCard', 'American Express', 'Discover'],
        allowNull: false,
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'payment_methods',
    timestamps: true,
});

const WishlistItems = sequelize.define('WishlistItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },   
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Products,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'wishlist_items',
    timestamps: true,
});

const Session = sequelize.define('Session', {
    sid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    sess: {
        type: DataTypes.JSON,
        allowNull: false
    },
    expire: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'session',
    timestamps: false
});

// Relationships
Users.hasMany(Orders, { foreignKey: 'user_id' });
Orders.belongsTo(Users, { foreignKey: 'user_id' });

Categories.hasMany(Products, { foreignKey: 'category_id' });
Products.belongsTo(Categories, { foreignKey: 'category_id' });

Orders.hasMany(OrderItems, { foreignKey: 'order_id' });
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

Products.hasMany(OrderItems, { foreignKey: 'product_id' });
OrderItems.belongsTo(Products, { foreignKey: 'product_id' });

Users.hasMany(Addresses, { foreignKey: 'user_id' });
Addresses.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasMany(Reviews, { foreignKey: 'user_id' });
Reviews.belongsTo(Users, { foreignKey: 'user_id' });

Products.hasMany(Reviews, { foreignKey: 'product_id' });
Reviews.belongsTo(Products, { foreignKey: 'product_id' });

Users.hasMany(PaymentMethods, { foreignKey: 'user_id' });
PaymentMethods.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasMany(WishlistItems, { foreignKey: 'user_id' });
WishlistItems.belongsTo(Users, { foreignKey: 'user_id' });

Products.hasMany(WishlistItems, { foreignKey: 'product_id' });
WishlistItems.belongsTo(Products, { foreignKey: 'product_id' });

const asyncDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Tables created');
    } catch (error) {
        console.log(error);
    }
};

asyncDatabase();

module.exports = {
    Users,
    Categories,
    Products,
    Orders,
    OrderItems,
    Addresses,
    Reviews,
    PaymentMethods,
    WishlistItems,
    Session,
};
