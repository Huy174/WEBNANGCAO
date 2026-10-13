import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsList from "./components/NewsList";

function App() {
  const title = "ReactJS";
  const year = 2026;
  return (
    <>
      <Header/>
      <main>
        <NewsList/>
      </main>
      <Footer/>
    </>
  );
}
export default App;
