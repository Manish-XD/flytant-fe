import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import 'react-quill/dist/quill.snow.css';
import Navbar from "@/Components/Navbar";
import ListScreen from "@/Components/ListScreen";
import deleteIcon from "../public/img/deleteIcon.png";
import styles from "../styles/AddNote.module.css";

export async function getServerSideProps(context) 
{
    const listRes = await fetch(`http://localhost:8000/?page=1`);
    const list = await listRes.json();
    return { props: { list } };
}
  
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }],
    ]
};

function AddNote({list}) 
{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    async function handleFocusOut() 
    {
        setDate(Date.now());
        const data = {
            title: title,
            description: description,
            date: date
        };
        try 
        {
            const response = fetch(`http://localhost:8000`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await response;
        }
        catch(err) 
        {
            console.log(err);
        }
    }

    return (
    <div className={styles.addNote__container}>
        <Navbar/>
        <div style={{ display: 'flex' }}>
            <ListScreen list={list}/>
            <div className={styles.editScreen}>
                <div className={styles.editScreen__header}>
                    <input value={title} onChange={(e) => { setTitle(e.target.value) }} onBlur={handleFocusOut} />
                    <button>
                        <Image src={deleteIcon} />
                    </button>
                </div>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} onBlur={handleFocusOut} />
            </div>
        </div>
    </div>
  );
}

export default AddNote;