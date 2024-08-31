import logo from "../public/img/logo.png";
import styles from "../styles/Navbar.module.css";

import Image from "next/image";

function Navbar() {
  return (
    <div className={styles.nav}>
        <Image src={logo}/>
        <h2>TODO</h2>
    </div>
  );
}

export default Navbar;