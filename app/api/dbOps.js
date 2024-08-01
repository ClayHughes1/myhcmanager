const clientConfig                = require('./dbConfig').clientConfig;
const { AsyncResource } = require('async_hooks');
const sql = require('mssql');


// Configuration for the second database (CLE_Admin)
// const adminDbConfig = {
//   user:process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database:process.env.DB_NAME,
//     options: {
//       encrypt: false, // If you're using Windows Azure
//       enableArithAbort: true, // Important for SQL Server
//     },
//     pool: {
//       max: 15, // Maximum number of connections in the pool
//       min: 2,  // Minimum number of connections in the pool
//       idleTimeoutMillis: 30000, // How long a connection is allowed to be idle before being closed
//     },
// };

const clientPool = new sql.ConnectionPool(clientConfig);

//Admin db opertions
//Login
const confirmLogin = async(email) =>{
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get all availability records 
//ujsed to populate the Calendar object 
const getAvailability = async() => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get availability ny Month
const getAvailabilityByMonth = async (month) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get availability by date
const getAvailabilityByDate = async (date) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//remove meeting record
const deleteAvailability = async (Id)  => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//remove meeting record
const deleteMeeting = async (Id)  => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get appointments by month
const getEventsByMonth = async (month) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get client appintments
const getClientAppts = async (email) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
  try {
    request.input('email', sql.VarChar, email);

    const result = await request.execute('uspGetClientAppts');
    if(result.recordset.length > 0)
    {
      return JSON.parse(result.recordsets[0][0].MyApptList);
    }
  } catch (err) {
    console.log(err);
      throw err;
  }

}

//Insert availability record
const insertAvailability = async (date,time) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Insert client meeting date data
const insertClientMeetDate = async (email,date,time, description) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Insert client meeting record
const insertClientMeetDateAdv = async (email,date,time, description,id) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Update client meeting date
const updateClientMeetDate = async (email,date,time) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Update Plan start and end date data 
const updatePlanDates = async (email,start,end) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get all clients
const getAllClients = async() => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get single client details
const getClientDetail = async(email) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Update client details
const updateClientDetail = async (ClientId,email,start,end,hasOrder) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get single client detail data by client id
const getClientDetailById = async(ClientId) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get clients who have placed an order
const getClientsWithOrder = async () => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Get clients that have not placed an order
const getClientsWithNoOrder = async () => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Validation process to ensure the user is already a client
const isValidClientEmail = async (userEmail) => {
  await clientPool.connect();
  // Connect to the database
  let request = await clientPool.request();
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

//Log all error 
const logError = async (ErroDetail) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('UserID', sql.NVarChar(255), ErroDetail.userID)
      .input('ErrorMessage', sql.NVarChar(sql.MAX), ErroDetail.errorMessage)
      .input('StackTrace', sql.NVarChar(sql.MAX), ErroDetail.stackTrace)
      .input('DeviceInfo', sql.NVarChar(sql.MAX), ErroDetail.deviceInfo)
      .input('AppVersion', sql.NVarChar(50), ErroDetail.appVersion)
      .input('OSVersion', sql.NVarChar(50), ErroDetail.osVersion)
      .input('AdditionalContext', sql.NVarChar(sql.MAX), ErroDetail.additionalContext)
      .output('Success', sql.Bit);


      if (result.output.Success) {
        res.status(201).send({ message: 'Error logged successfully', success: true });
      } else {
        res.status(500).send({ message: 'Failed to log error', success: false });
      }
  } catch (err) {
    console.error('Database error:', err);
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
  getClientAppts,
  insertClientMeetDate,
  insertClientMeetDateAdv,
  logError,
  updateClientMeetDate,
  updatePlanDates,
  updateClientDetail,
  isValidClientEmail,
} 
