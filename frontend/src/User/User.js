import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/users'
const IMAGE_URL = 'http://localhost:5000/uploads'

const User = () => {
  const [users, setUsers] = useState([])
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    image1: null,
    image2: null,
    address: '',
    designation: '',
    oldImage1: '',
    oldImage2: '',
  })

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API)
      if (res.data && Array.isArray(res.data.message)) {
        setUsers(res.data.message)
      } else if (Array.isArray(res.data)) {
        setUsers(res.data)
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers([])
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    data.append('name', form.name)
    data.append('email', form.email)
    data.append('designation', form.designation)
    data.append('address', form.address)
    data.append('oldImage1', form.oldImage1)
    data.append('oldImage2', form.oldImage2)

    if (form.image1) data.append('image1', form.image1)
    if (form.image2) data.append('image2', form.image2)

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, data)
      } else {
        await axios.post(API, data)
      }

      resetForm()
      fetchUsers()
    } catch (err) {
      console.error('Error submitting user form:', err)
    }
  }

  const handleEdit = (user) => {
    setEditId(user.Id)
    setForm({
      name: user.Name || '',
      email: user.Email || '',
      image1: null,
      image2: null,
      address: user.Address || '',
      designation: user.Designation || '',
      oldImage1: user.Image1 || '',
      oldImage2: user.Image2 || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.delete(`${API}/${id}`)
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  const resetForm = () => {
    setEditId(null)
    setForm({
      name: '',
      email: '',
      image1: null,
      image2: null,
      address: '',
      designation: '',
      oldImage1: '',
      oldImage2: '',
    })
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User CRUD</h2>
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Image 1</label>
            <input
              type="file"
              className="form-control"
              name="image1"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Image 2</label>
            <input
              type="file"
              className="form-control"
              name="image2"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Designation</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={form.designation}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-control"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2">
            {editId ? 'Update' : 'Save'}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Image 1</th>
              <th>Image 2</th>
              <th>Designation</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.Id}>
                  <td>{user.Id}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>
                    {user.Image1 && (
                      <img
                        src={`${IMAGE_URL}/${user.Image1}`}
                        width="60"
                        height="60"
                        style={{ objectFit: 'cover' }}
                        alt="Image 1"
                      />
                    )}
                  </td>
                  <td>
                    {user.Image2 && (
                      <img
                        src={`${IMAGE_URL}/${user.Image2}`}
                        width="60"
                        height="60"
                        style={{ objectFit: 'cover' }}
                        alt="Image 2"
                      />
                    )}
                  </td>
                  <td>{user.Designation}</td>
                  <td>{user.Address}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.Id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default User

