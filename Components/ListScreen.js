import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import ListItem from "./UI/ListItem";
import Loading from "@/Components/UI/Loading";
import styles from "../styles/ListScreen.module.css";
import addTodo from "../public/img/addTodo.png";
import searchIcon from "../public/img/searchIcon.png";

export async function getServerSideProps(context)
{   
    const res = await fetch('http://localhost:8000/?page=1');
    const data = await res.json();
    return { props: { data }};
}

function ListScreen({list, currentNoteTitle, currentNoteDescription, currentNoteDate, currentNoteId}) 
{
    const divRef = useRef(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(list);
    const [hasMoreData, setHasMoreData] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
          const div = divRef.current;
          if (div.scrollTop + div.clientHeight >= div.scrollHeight - 1 && hasMoreData && !loading) 
          {
            handleGetNotes();
          }
        };
    
        const div = divRef.current;
        if (div) div.addEventListener("scroll", handleScroll);
    
        return () => {
          if (div) div.removeEventListener("scroll", handleScroll);
        };
      }, [hasMoreData, loading]);

    function handleSearch(e) 
    {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = list.filter(item => item.title.toLowerCase().includes(query));
        setFilteredData(filtered);
    };

    async function handleGetNotes() 
    {
        if (loading || !hasMoreData) return;
        setLoading(true);
        const newPage = page + 1;
        try 
        {
            const res = await fetch(`http://localhost:8000/?page=${newPage}`);
            const newData = await res.json();

            if (newData.length === 0) 
            {
                setHasMoreData(false);
            } 
            else 
            {
                setFilteredData((prevData) => [...prevData, ...newData]);
                setPage(newPage);
            }
        } 
        catch (err) 
        {
            console.error('Error fetching data:', err);
        } 
        finally 
        {
            setLoading(false);
        }
    }

    async function handleTodoOnClick() 
    {
        try 
        {
            const response = await fetch('http://localhost:8000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            router.push(`/note/${result.id}`);
        } 
        catch(err) 
        {
            console.error('Error:', err);
        }
    }
    return (
    <div className={styles.listScreen__body2}>
        <div className={styles.listScreen__header}>
            <button className={styles.addTodoBtn} onClick={handleTodoOnClick}>
                <Image src={addTodo}/>
                <span>TODO</span>
            </button>
            <div className={styles.searchContainer}>
                {visible && <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={handleSearch} 
                            className={styles.searchInput} 
                            placeholder="Search..."
                            onBlur={()=>{setSearchQuery('');setFilteredData(list);setVisible(false)}}/>}

                {!visible && <button className={styles.searchBtn} onClick={()=>{setVisible(true)}}>
                        <Image src={searchIcon} alt="Search" />
                        </button>}
            </div>
        </div>
        <div className={styles.listScreen__listItems} ref={divRef}>
            {filteredData.map((listItem, idx)=>{
                return(<ListItem key={idx} title={listItem.title} description={listItem.description} date={listItem.date} id={listItem._id} currentNoteTitle={currentNoteTitle} currentNoteDescription={currentNoteDescription} currentNoteDate={currentNoteDate} currentNoteId={currentNoteId}/>)
            })}
            {loading && <Loading size={"8rem"} />}
        </div>
    </div>
  );
}

export default ListScreen;