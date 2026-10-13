import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsList from "./components/NewsList";
import ChangeTitle from "./components/ChangeTitle";
import ToggleContent from "./components/ToggleContent";
import NewsStatus from "./components/NewsStatus";
import CategoryList from "./components/CategoryList";

function App() {
  return (
    <>
      <Header />
      <main>
        <ChangeTitle />
        <ToggleContent />
        <NewsStatus />
        <CategoryList/>
        <NewsList />
      </main>
      <Footer />
    </>
  );
}
export default App;
