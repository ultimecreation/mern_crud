import { useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { v4 } from 'uuid'

function App() {
  const clientIo = io("http://localhost:3001")
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({})
  const formRef = useRef()


  clientIo.on("read", (data) => {
    setUsers(data)
    console.log("Fetching data: ", data)
  })

  const handleSubmit = async e => {
    e.preventDefault()

    if (typeof formData.id === 'undefined') {
      formData.id = v4()
      clientIo.emit("create", { ...formData })
      formRef.current.reset()
      return setFormData({})
    }
    clientIo.emit("update", { ...formData })
  }

  const handleEdit = (user) => {
    console.log(user)
    setFormData({ name: user.name, age: user.age, id: user.id })
  }
  const handleDelete = id => {
    clientIo.emit("delete", id)
  }

  const handleChange = e => {
    setFormData(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }
  return (
    <div className="container p-3">
      <h1>Crud</h1>
      <div className="col-6 mx-auto">
        <ul className="unstyled p-0">
          {users && users.map((user, index) => {
            return <li className='list-group-item d-flex justify-content-between' key={index}>
              <p>{user.name}</p>
              <div>
                <button className='btn btn-warning btn-sm' onClick={() => handleEdit(user)}>Edit</button>
                <button className='btn btn-danger btn-sm ms-2' onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </li>
          })}
        </ul>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="mb-3">
            <input type="hidden" name="id" defaultValue={formData.id ?? null} />
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name ?? ''}
              onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="text"
              name="age"
              className="form-control"
              id="age"
              value={formData.age ?? ''}
              onChange={handleChange} />
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
