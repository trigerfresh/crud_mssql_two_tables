const { sql, poolPromise } = require('../config/db.js')

// =========================
// GET ALL USERS
// =========================
const getAllUsers = async () => {
  const pool = await poolPromise

  const result = await pool.request().query(`
    SELECT
      u.Id,
      u.Name,
      u.Email,
      u.Image1,
      u.Image2,
      ud.Address,
      ud.Designation
    FROM Users u
    INNER JOIN UserDetails ud
      ON u.Id = ud.UserId
    WHERE u.Active = '0'
      AND ud.Active = '0'
    ORDER BY u.Id DESC
  `)

  return result.recordset
}

// =========================
// GET USER BY ID
// =========================
const getUserById = async (id) => {
  const pool = await poolPromise

  const result = await pool.request().input('Id', sql.Int, id).query(`
      SELECT
        u.Id,
        u.Name,
        u.Email,
        u.Image1,
        u.Image2,
        ud.UserId,
        ud.Designation,
        ud.Address
      FROM Users u
      INNER JOIN UserDetails ud
        ON u.Id = ud.UserId
      WHERE u.Id = @Id
        AND u.Active = '0'
        AND ud.Active = '0'
    `)

  return result.recordset
}

// =========================
// CREATE USER
// =========================
const createUser = async (data) => {
  const pool = await poolPromise

  const transaction = new sql.Transaction(pool)

  await transaction.begin()

  try {
    // Insert into Users
    const userResult = await transaction
      .request()
      .input('Name', sql.NVarChar, data.name)
      .input('Email', sql.NVarChar, data.email)
      .input('Image1', sql.NVarChar, data.image1)
      .input('Image2', sql.NVarChar, data.image2)
      .input('Active', sql.NVarChar, '0').query(`
        INSERT INTO Users
        (
          Name,
          Email,
          Image1,
          Image2,
          Active
        )
        OUTPUT INSERTED.Id
        VALUES
        (
          @Name,
          @Email,
          @Image1,
          @Image2,
          @Active
        )
      `)

    const userId = userResult.recordset[0].Id

    // Insert into UserDetails
    await transaction
      .request()
      .input('UserId', sql.Int, userId)
      .input('Designation', sql.NVarChar, data.designation)
      .input('Address', sql.NVarChar, data.address)
      .input('Active', sql.NVarChar, '0').query(`
        INSERT INTO UserDetails
        (
          UserId,
          Designation,
          Address,
          Active
        )
        VALUES
        (
          @UserId,
          @Designation,
          @Address,
          @Active
        )
      `)

    await transaction.commit()

    return userId
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

// =========================
// UPDATE USER
// =========================
const updateUser = async (id, data) => {
  const pool = await poolPromise

  const transaction = new sql.Transaction(pool)

  await transaction.begin()

  try {
    // Update Users
    await transaction
      .request()
      .input('Id', sql.Int, id)
      .input('Name', sql.NVarChar, data.name)
      .input('Email', sql.NVarChar, data.email)
      .input('Image1', sql.NVarChar, data.image1)
      .input('Image2', sql.NVarChar, data.image2).query(`
        UPDATE Users
        SET
          Name = @Name,
          Email = @Email,
          Image1 = @Image1,
          Image2 = @Image2
        WHERE Id = @Id
      `)

    // Update UserDetails
    await transaction
      .request()
      .input('UserId', sql.Int, id)
      .input('Designation', sql.NVarChar, data.designation)
      .input('Address', sql.NVarChar, data.address).query(`
        UPDATE UserDetails
        SET
          Designation = @Designation,
          Address = @Address
        WHERE UserId = @UserId
      `)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

// =========================
// SOFT DELETE USER
// =========================
const deleteUser = async (id) => {
  const pool = await poolPromise

  const transaction = new sql.Transaction(pool)

  await transaction.begin()

  try {
    // Soft delete Users
    await transaction.request().input('Id', sql.Int, id).query(`
        UPDATE Users
        SET Active = '1'
        WHERE Id = @Id
      `)

    // Soft delete UserDetails
    await transaction.request().input('UserId', sql.Int, id).query(`
        UPDATE UserDetails
        SET Active = '1'
        WHERE UserId = @UserId
      `)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
