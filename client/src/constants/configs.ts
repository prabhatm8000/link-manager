const configs = {
    mode: "dev", 
    // mode: "prod", 
    devBaseUrl: "http://localhost:1905/api/v1",
    serverBaseUrl: "/api/v1",
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export default configs;
