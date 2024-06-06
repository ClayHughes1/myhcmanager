const adminConfig                = require('./dbConfig').adminConfig;
const sql = require('mssql');


// Configuration for the second database (CLE_Admin)
const adminDbConfig = {
    user: process.env.ADMIN_DB_USERNAME,
    password: process.env.ADMIN_DB_PASSWORD,
    server: process.env.ADMIN_DB_SERVER,
    database: process.env.ADMIN_DB_NAME,
    options: {
      encrypt: false, // If you're using Windows Azure
      enableArithAbort: true, // Important for SQL Server
    },
    pool: {
      max: 15, // Maximum number of connections in the pool
      min: 2,  // Minimum number of connections in the pool
      idleTimeoutMillis: 30000, // How long a connection is allowed to be idle before being closed
    },
};

const adminPool = new sql.ConnectionPool(adminDbConfig);

//Admin db opertions
//Login
const confirmLogin = async(email) =>{
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      request.input('email', sql.VarChar, email);

      const result = await request.execute('uspGetAdminLogin');
      if(result.recordset.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].AdminLogin).map(item => item.Email);
      }
  } catch (err) {
      throw err;
  }
}

const getAvailability = async() => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {

      const result = await request.execute('uspGetAvailability');
      if(result.recordsets.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].Availability);
      }
  } catch (err) {
    console.log('ERROR...............     '+err);
      throw err;
  }

}

const getAvailabilityByMonth = async (month) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  console.log(month);
  try {
    request.input('month', sql.VarChar, month);

    const result = await request.execute('uspGetAvailabilityByMonth');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].DatesAvailMonth);
    }
  } catch (err) {
      throw err;
  }
}

const getAvailabilityByDate = async (date) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('date', sql.VarChar, date);

    const result = await request.execute('uspGetAvailabilityByDate');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].DatesAvailDate);
    }
  } catch (err) {
      throw err;
  }
}

const deleteAvailability = async (Id)  => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  console.log('THE ID TO DELETE IS \n',Id);
  try {
    request.input('Id', sql.Int, Id);
    const result = await request.execute('uspDeleteAvailability');

    // Get the return value
    let returnValue = result.returnValue;
    if(returnValue > 0)
    {
      return returnValue;
    }
  } catch (err) {
      throw err;
  }
}

const deleteMeeting = async (Id)  => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  console.log('THE ID TO DELETE IS \n',Id);
  try {
    request.input('Id', sql.Int, Id);
    const result = await request.execute('uspRemoveMeeting');

    // Get the return value
    let returnValue = result.returnValue;
    if(returnValue > 0)
    {
      return returnValue;
    }
  } catch (err) {
      throw err;
  }
}

const getEventsByMonth = async (month) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('month', sql.VarChar, month);

    const result = await request.execute('uspGetEventsByMonth');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].DatesAvailMonth);
    }
  } catch (err) {
      throw err;
  }

}

const insertAvailability = async (date,time) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('date', sql.VarChar, date);
    request.input('time', sql.VarChar, time);

    const result = await request.execute('uspInsertAvailability');
    console.log('RESULTS      \n'+JSON.stringify(result.recordsets[0][0].Id));
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
      throw err;
  }
}

//Client db opereations
const getClientProfile = async() =>{
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {

      const result = await request.execute('uspGetClientsProfile');
      if(result.recordsets.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].ClientDetail);
      }
  } catch (err) {
    console.log('ERROR...............     '+err);
      throw err;
  }
}

//Insert client detail
const insertClientDetail = async (email,first,last,start,end,hasOrder) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('email', sql.VarChar, email);
    request.input('first', sql.VarChar, first);
    request.input('last', sql.VarChar, last);
    request.input('planstart', sql.VarChar, start);
    request.input('planend', sql.VarChar, end);
    request.input('hasOrder', sql.VarChar, hasOrder);

    const result = await request.execute('uspInsertClientDetail');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
    console.log('ERROR \n'+err);
      throw err;
  }
}

const insertClientMeetDate = async (email,date,time, description) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('email', sql.VarChar, email);
    request.input('meetdate', sql.VarChar, date);
    request.input('meettime', sql.VarChar, time);
    request.input('description', sql.VarChar, description);

    const result = await request.execute('uspInsertClientMeetDate');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
      throw err;
  }

}

const insertClientMeetDateAdv = async (email,date,time, description,id) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('email', sql.VarChar, email);
    request.input('meetdate', sql.VarChar, date);
    request.input('meettime', sql.VarChar, time);
    request.input('description', sql.VarChar, description);
    request.input('Id', sql.Int, id);

    const result = await request.execute('uspInsertClientMeetDate');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
      throw err;
  }

}

const updateClientMeetDate = async (email,date,time) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('email', sql.VarChar, email);
    request.input('date', sql.VarChar, date);
    request.input('time', sql.VarChar, time);

    const result = await request.execute('uspUpdateClientMeetDate');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
      throw err;
  }

}

const updatePlanDates = async (email,start,end) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('email', sql.VarChar, email);
    request.input('start', sql.VarChar, start);
    request.input('end', sql.VarChar, end);

    const result = await request.execute('uspUpdatePlanDates');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].Id);
    }
  } catch (err) {
      throw err;
  }

}

const getAllClients = async() => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {

      const result = await request.execute('uspGetAllClients');
      if(result.recordsets.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].AllClients);
      }
  } catch (err) {
    console.log('ERROR...............     '+err);
      throw err;
  }

}

const getClientDetail = async(email) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      request.input('email', sql.VarChar, email);

      const result = await request.execute('uspGetClientsDetail');
      if(result.recordset.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].ClientDetail);
      }
  } catch (err) {
      throw err;
  }
}

const updateClientDetail = async (ClientId,email,start,end,hasOrder) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
    request.input('id', sql.INT, ClientId);
    request.input('email', sql.VarChar, email);
    request.input('planstart', sql.VarChar, start);
    request.input('planend', sql.VarChar, end);
    request.input('hasOrder', sql.BIT, hasOrder);

    const result = await request.execute('uspUpdateClientDetail');
    if(result.returnValue > -1)
    {
      return JSON.parse(result.returnValue);
    }
  } catch (err) {
    console.log('ERROR \n'+err);
      throw err;
  }
}

const getClientDetailById = async(ClientId) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      request.input('Id', sql.Int, ClientId);

      const result = await request.execute('uspGetClientsDetailById');
      if(result.recordset.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].ClientDetail);
      }
  } catch (err) {
      throw err;
  }
}

const getClientsWithOrder = async () => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      const result = await request.execute('uspGetClientsWithOrders');
      if(result.recordset.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].ClientsWithOrders);
      }
  } catch (err) {
      throw err;
  }
}

const getClientsWithNoOrder = async () => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      const result = await request.execute('uspGetClientsWithNoOrders');
      if(result.recordset.length > 0)
      {
        return JSON.parse(result.recordsets[0][0].ClientsWithOrders);
      }
  } catch (err) {
      throw err;
  }
}

const isValidClientEmail = async (userEmail) => {
  await adminPool.connect();
  // Connect to the database
  let request = await adminPool.request();
  try {
      request.input('email', sql.VarChar, userEmail);

      const result = await request.execute('uspIsValidClientEmail');
      if(result.recordset.length > 0)
      {
        return result.recordset[0].ISVALID;
      }
  } catch (err) {
      throw err;
  }
}


module.exports = {
  confirmLogin,
  deleteAvailability,
  deleteMeeting,
  getClientProfile,
  getAvailability,
  insertAvailability,
  insertClientDetail,
  getAllClients,
  getAvailabilityByMonth,
  getAvailabilityByDate,
  getClientDetail,
  getClientsWithOrder,
  getClientsWithNoOrder,
  getClientDetailById,
  getEventsByMonth,
  insertClientMeetDate,
  insertClientMeetDateAdv,
  updateClientMeetDate,
  updatePlanDates,
  updateClientDetail,
  isValidClientEmail,
} 
