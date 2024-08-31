import Link from "next/link";

import styles from "../../styles/ListScreen.module.css";
import formatDate from "@/util/dateFormat";
import removeAngularBrackets from "@/util/stringFormat";

function ListItem({title, description, date, id, currentNoteTitle, currentNoteDescription, currentNoteDate, currentNoteId}) 
{
  return id === currentNoteId ?
  <Link href={`/note/${currentNoteId}`} className={styles.listItem}>
    <h1>{currentNoteTitle}</h1>
      <div className={styles.listItem__content}>
        <p className={styles.listItem__description}>{removeAngularBrackets(currentNoteDescription)}{ currentNoteDescription? '...' : '' }</p>
        <p className={styles.listItem__time}>{formatDate(currentNoteDate)}</p>
      </div>
  </Link>
  :
  <Link href={`/note/${id}`} className={styles.listItem}>
    <h1>{title}</h1>
      <div className={styles.listItem__content}>
        <p className={styles.listItem__description}>{removeAngularBrackets(description)}...</p>
        <p className={styles.listItem__time}>{formatDate(date)}</p>
      </div>
  </Link>;
}

export default ListItem;