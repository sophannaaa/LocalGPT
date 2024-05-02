import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import MR_LOGO from "@assets/MRLogo.png";
import {  Stack } from "@fluentui/react";
import { useContext, useEffect } from "react";

import { AppStateContext } from "@state/AppProvider";

const Layout = () => {
    const appStateContext = useContext(AppStateContext)

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 480) {
          } else {
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div className={styles.layout}>
            <Outlet />
        </div>
    );
};

export default Layout;