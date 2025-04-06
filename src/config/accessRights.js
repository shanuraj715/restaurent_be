const ACCESS_RIGHTS = {
  CREATE_CATEGORY: ["admin"],
  UPDATE_CATEGORY: ["admin"],
  DELETE_CATEGORY: ["admin"],
  GET_ALL_CATEGORIES: ["admin", "user"],
  GET_CATEGORY: ["admin", "user"],

  CREATE_USER: ["admin"],
  UPDATE_USER: ["admin"],
  DELETE_USER: ["admin"],
  GET_ALL_USERS: ["admin"],
  GET_USER: ["admin", "user"],

  CREATE_FOOD_ITEM: ["admin"],
  UPDATE_FOOD_ITEM: ["admin"],
  DELETE_FOOD_ITEM: ["admin"],
  GET_ALL_FOOD_ITEMS: ["admin", "user"],
  GET_FOOD_ITEM: ["admin", "user"],

  CREATE_ORDER: ["admin", "user"],
  UPDATE_ORDER: ["admin", "user"],
  DELETE_ORDER: ["admin"],
  GET_ALL_ORDERS: ["admin", "user"],
  GET_ORDER: ["admin", "user"],

  CREATE_ADMIN_USER: ["admin"],
  UPDATE_ADMIN_USER: ["admin"],
  DELETE_ADMIN_USER: ["admin"],
  GET_ALL_ADMIN_USERS: ["admin"],
  GET_ADMIN_USER: ["admin"],

  UPDATE_SETTINGS: ["admin"],
  GET_SETTINGS: ["admin", "user"],
  GET_ALL_SETTINGS: ["admin", "user"],
  GET_ALL_LOGIN_LOGS: ["admin"],
  GET_LOGIN_LOG: ["admin"],
};

module.exports = ACCESS_RIGHTS;
