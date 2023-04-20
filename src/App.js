import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ListView from "./components/ListView";
import Wrapper from "./components/Wrapper";

function App() {
  const [showSetting, setShowSetting] = useState({
    currentPage: 1,
    quantityPerPage: 24,
    totalPage: 0,
  });
  const [listPosts, setListPosts] = useState();

  // fake Data
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((posts) => {
        const listLength = posts.length;

        setListPosts(posts);

        setShowSetting((currSetting) => {
          const totalPage = Math.floor(
            listLength / currSetting.quantityPerPage
          );

          return { ...currSetting, totalPage };
        });
      });
  }, []);

  // Data want show
  const itemsShow = useMemo(() => {
    if (!Array.isArray(listPosts)) return;

    const quantityItemsInCurrentPage =
      showSetting.currentPage * showSetting.quantityPerPage;

    return [...listPosts].splice(0, quantityItemsInCurrentPage);
  }, [showSetting, listPosts]);

  const handleChangeShowSetting = () => {
    if (!Array.isArray(listPosts)) return;

    plusPage();
  };

  const plusPage = () => {
    if (showSetting.currentPage < showSetting.totalPage) {
      setShowSetting((prev) => {
        return { ...prev, currentPage: prev.currentPage + 1 };
      });
    }
  };

  if (!Array.isArray(itemsShow)) return;

  return (
    <div className="App">
      <Wrapper>
        <ListView data={itemsShow} showNext={handleChangeShowSetting} />
      </Wrapper>
    </div>
  );
}

export default App;

// currentPage = 1,
// quantity per page, ex: 10
// totalPage = 10
