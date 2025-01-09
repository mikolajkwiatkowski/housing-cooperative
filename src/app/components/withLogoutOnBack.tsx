// withLogoutOnBack.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Typowanie komponentu, który przyjmie HOC
const withLogoutOnBack = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const handlePopState = () => {
                if (window.location.pathname === "/loginPanel") {
                    // Usuń token z localStorage lub sessionStorage, jeśli użytkownik wróci do logowania
                    localStorage.removeItem('token');
                    sessionStorage.clear();
                    router.push("/userPanel"); // Przekierowanie na stronę logowania
                }
            };

            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }, [router]);

        // Zwróć przekazany komponent
        return <WrappedComponent {...props} />;
    };
};

export default withLogoutOnBack;
