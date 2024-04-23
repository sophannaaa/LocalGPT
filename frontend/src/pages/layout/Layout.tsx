import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import MR_LOGO from "../../assets/MRLogo.png";
import {  Stack } from "@fluentui/react";
import { useContext, useEffect } from "react";

import { AppStateContext } from "../../state/AppProvider";

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
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={MR_LOGO}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>Mixed Reality Compliance Copilot</h1>
                        </Link>
                    </Stack>
                </Stack>
            </header>
            <Outlet />
        </div>
    );
};

export default Layout;