import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home.page"
import EditorPage from "./pages/Editor.page"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success:{
              theme: {
                primary: '#4aed88',
              }
            }
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App