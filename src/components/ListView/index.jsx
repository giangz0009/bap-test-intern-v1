import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import RefreshIcon from "../../assets/icons/RefreshIcon";

const PostItem = ({ data, showNext }) => {
  return (
    <div className={styles.postItemContainer}>
      <div className={styles.postItem}>
        <h1>{data.title}</h1>
        <p>{data.body}</p>
      </div>
    </div>
  );
};

const ListView = ({ data, showNext }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [refreshConfig, setRefreshConfig] = useState({
    isLoading: false,
    pStartY: 0,
    pCurrenY: 0,
    changeY: 0,
  });

  const postListRef = useRef(null);
  const postListContainerRef = useRef(null);

  //   Add Event Window Scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  // Add Event Touch
  useEffect(() => {
    document.addEventListener("touchstart", handleSwipeStart);
    document.addEventListener("touchmove", handleSwipe);
    document.addEventListener("touchend", handleSwipeEnd);

    return () => {
      document.removeEventListener("touchstart", handleSwipeStart);
      document.removeEventListener("touchmove", handleSwipe);
      document.removeEventListener("touchend", handleSwipeEnd);
    };
  }, [refreshConfig]);

  useEffect(() => {}, [refreshConfig.isLoading]);

  // onChange refreshConfig.changeY
  useEffect(() => {
    if (!postListContainerRef) return;

    if (!postListRef) return;

    const { changeY } = refreshConfig;

    console.log(changeY);

    if (changeY <= 80) {
      postListContainerRef.current.style.marginTop = `${changeY + 50}px`;
    } else {
      postListRef.current.classList.add(styles["load-init"]);
      setRefreshConfig((prev) => ({ ...prev, isLoading: true }));
    }
  }, [refreshConfig.changeY]);

  // onChange refreshConfig.pCurrenY and pStartY
  useEffect(() => {
    const changeY =
      refreshConfig.pStartY < refreshConfig.pCurrenY
        ? Math.abs(refreshConfig.pStartY - refreshConfig.pCurrenY)
        : 0;

    setRefreshConfig((prev) => {
      return { ...prev, changeY };
    });
  }, [refreshConfig.pCurrenY, refreshConfig.pStartY]);

  const _renderListPosts = useMemo(() => {
    if (!Array.isArray(data)) return;

    return data.map((post) => <PostItem data={post} key={post.id} />);
  }, [data]);

  //   Handle event Scroll
  const handleScroll = (e) => {
    const sbHeight = document.body.scrollHeight;
    const clientHeight = window.innerHeight;
    const position = document.documentElement.scrollTop + clientHeight;

    const percentPosition = (position / sbHeight).toFixed(1);

    setScrollPosition(position);

    if (percentPosition >= 0.8) {
      showNext();
    }
  };

  const handleSwipeStart = (e) => {
    if (!refreshConfig.isLoading) {
      const touch = e.targetTouches[0];
      setRefreshConfig((prev) => {
        return {
          ...prev,
          pStartY: touch.screenY,
        };
      });
    }
  };

  const handleSwipe = (e) => {
    if (!refreshConfig.isLoading) {
      const touch = e.changedTouches[0];

      setRefreshConfig((prev) => {
        return { ...prev, pCurrenY: touch.screenY };
      });
    }
  };

  const handleSwipeEnd = () => {
    if (!postListContainerRef) return;

    if (!postListRef) return;

    if (!refreshConfig.isLoading) return;

    const { isLoading } = refreshConfig;

    console.log(isLoading);

    if (isLoading) {
      postListRef.current.classList.add("load-start");

      setRefreshConfig((prev) => ({ ...prev, isLoading: false }));

      setTimeout(() => {
        postListContainerRef.current.style.marginTop = `0px`;

        postListRef.current.classList.remove("load-init");
        postListRef.current.classList.remove("load-start");
      }, 500);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  if (!Array.isArray(data)) return;

  return (
    <div className={styles.postList} ref={postListRef}>
      <div className={styles.spinner}>
        <RefreshIcon size={30} />
      </div>
      <div className={styles.container} ref={postListContainerRef}>
        {_renderListPosts}
      </div>
    </div>
  );
};

export default memo(ListView);
