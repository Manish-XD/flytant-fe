import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import 'react-quill/dist/quill.snow.css';
import ListScreen from "@/Components/ListScreen";
import Navbar from "@/Components/Navbar";
import styles from "../../styles/EditScreen.module.css";
import deleteIcon from "../../public/img/deleteIcon.png";
import arrow from "../../public/img/arrow.png";

export async function getServerSideProps(context) 
{
  const { slug } = context.query;
  const res = await fetch(`http://localhost:8000/${slug}`);
  const data = await res.json();
  const listRes = await fetch(`http://localhost:8000/?page=1`);
  const list = await listRes.json();
  return { props: { data, list } };
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }],
  ]
};

function note({ data, list }) 
{
  const router = useRouter();
  const { slug } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(()=>{
    if(slug)
    {
      setTitle(data.title);
      setDescription(data.description);
      setDate(data.date);
    }
  },[slug]);

  async function handleDelete()
  {
    try 
    {
      const response = await fetch(`http://localhost:8000/deleteNote/${slug}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const result = await response.json();
      router.push(`/Lists`);
    }
    catch(err)
    {
      console.log(err);
    }
  }

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
      const response = fetch(`http://localhost:8000/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json();
    }
    catch (error) 
    {
      console.log(error);
    }
  }
  
  return (
    <div className={styles.editScreen__container}>
      <Navbar />
      <div className={styles.editBlock}>
        <Link href={"/Lists"} style={{display: 'flex', alignItems: 'center', width: '6rem', justifyContent: 'space-between', color: '#000000', textDecoration: 'none', fontWeight: 600, fontSize: '24px'}}>
          <Image src={arrow} alt="back arrow"/>
          Back
        </Link>
        <ListScreen list={list} currentNoteTitle={title} currentNoteDescription={description} currentNoteDate={date} currentNoteId={slug} />
        <div className={styles.editScreen}>
          <div className={styles.editScreen__header}>
            <input value={title} onChange={(e) => { setTitle(e.target.value) }} onBlur={handleFocusOut} />
            <button onClick={handleDelete}>
              <Image src={deleteIcon} />
            </button>
          </div>
          <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} onBlur={handleFocusOut} />
        </div>
      </div>
    </div>
  );
}

export default note;