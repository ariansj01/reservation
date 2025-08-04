// import React, { useCallback } from 'react'
import { RouterProvider } from 'react-router-dom'
import App_Routes from './Routes/App_Routes'
import './App.css'
const App = () => {
  return (
    <div className="min-h-screen">
      <RouterProvider router={App_Routes} />
    </div>
  )
}

export default App
