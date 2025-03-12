import pool from "./dbManager.mjs";



const dbManager = {
    read: async (query, params = []) => {
      const { rows } = await pool.query(query, params);
      return rows;
    },
    create: async (query, params) => { 
      const { rows } = await pool.query(query, params);
      return rows;
    },
    update: async (query, params) => {
      const { rows } = await pool.query(query, params);
      return rows;
    },
    purge: async (query, params) => {
      const { rows } = await pool.query(query, params);
      return rows;
    }
  };
  

export default dbManager;
