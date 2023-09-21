import {Routes, Route} from "react-router-dom";
import {Container} from "react-bootstrap";
import { Store } from "./pages/Store";
import {Navbar} from "./components/Navbar";
import { ShoppingCardProvider } from "./context/ShoppingCardContext";

function App() {  
  return (
    <ShoppingCardProvider>
    <Navbar />
    <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Store />} />
        </Routes>
      </Container>
    </ShoppingCardProvider>
    
  ) 
}

export default App
