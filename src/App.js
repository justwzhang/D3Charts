import './App.css';
import { GlobalStoreContextProvider } from './store';
import { 
  NavBar ,
  HomeScreen
} from './components';
import{
  BarChart
} from "./components/Charts"


const App = () => {
  return (
    <GlobalStoreContextProvider>
      <div style={{height:"100vh", width:"100vw", background:"#98c1d9"}}>
        <NavBar/>
        <HomeScreen/>
      </div>
      
      {/* <BarChart/> */}
    </GlobalStoreContextProvider>
  );
}

export default App;
