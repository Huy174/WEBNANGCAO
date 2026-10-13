function App() {
  const title = "ReactJS";
  const year = 2026;
  return (
    <>
      <h1 className="title">{title}</h1>
      <p>Năm học: {year}</p>
      <p>Hôm nay: {new Date().toLocaleDateString()}</p>
    </>
  );
}
export default App;
