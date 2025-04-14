import{c as j,u,r as x,j as e,G as A,t as E,e as R,l as q,f as O,b as S,h as z,i as I}from"./index-B270FbaC.js";import $ from"./PageNotFound-CRIm5mdU.js";import{B as h,u as b,T as g,L as v,a as B,b as G,c as D,R as V,d as f}from"./AppRouter-E6daGDve.js";import{u as y,C,a as k,b as P,L as m,I as d,c as F,d as Z}from"./index.esm-BMG1aEPd.js";const H=()=>{const l=j(),i=u(a=>a.user),t=x.useRef(null),s=a=>{const{credential:n}=a;l(q({credential:n}))},r=()=>{var a,n;(n=(a=t.current)==null?void 0:a.getElementsByTagName("div"))==null||n[3].click()};return e.jsxs(e.Fragment,{children:[e.jsx("span",{ref:t,style:{display:"none"},children:e.jsx(A,{onSuccess:a=>s(a),onError:()=>E.error("Something went wrong")})}),e.jsxs(h,{onClick:r,disabled:i==null?void 0:i.loading,type:"button",className:"w-full mt-2 px-4 flex items-center justify-center gap-1",children:[e.jsx(R,{}),e.jsx("span",{children:"Login with Google"})]})]})},M=()=>{const{register:l,handleSubmit:i,formState:{errors:t}}=y(),s=u(o=>o.user),r=j(),a=b();x.useEffect(()=>{s!=null&&s.isAuthenticated&&a("/workspace")},[s]);const n=i(o=>{r(q({email:o.email,password:o.password}))});return e.jsxs(e.Fragment,{children:[e.jsx(C,{children:e.jsx(k,{children:e.jsx(g,{className:"text-center",children:"Login"})})}),e.jsx(P,{children:e.jsxs("form",{className:"flex flex-col gap-4",onSubmit:n,children:[e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"email",children:"Email"}),e.jsx(d,{...l("email",{required:"This field is required."}),id:"email",type:"email",placeholder:"Your email address",className:"w-full",autoComplete:"email"}),t.email&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:t.email.message})]}),e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"password",children:"Password"}),e.jsx(d,{...l("password",{required:"This field is required."}),id:"password",type:"password",placeholder:"Password",className:"w-full",autoComplete:"password"}),t.password&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:t.password.message})]}),e.jsx(h,{disabled:s==null?void 0:s.loading,type:"submit",className:"mt-2 px-4 flex items-center justify-center gap-1",children:e.jsx("span",{children:"Login"})})]})}),e.jsxs(F,{className:"flex-col gap-4",children:[e.jsxs("div",{className:"w-full text-center text-black/70 dark:text-white/70",children:["don't have an account?"," ",e.jsx(v,{to:"/auth/signup",className:"text-blue-500",children:"Signup"})]}),e.jsxs("div",{className:"flex w-full gap-1 items-center text-muted-foreground",children:[e.jsx("span",{className:"pt-0.5 mt-1 w-full bg-muted-foreground/60"}),e.jsx("span",{children:"or"}),e.jsx("span",{className:"pt-0.5 mt-1 w-full bg-muted-foreground/60"})]}),e.jsx(H,{})]})]})},U=()=>{const{register:l,handleSubmit:i,getValues:t,watch:s,formState:{errors:r}}=y(),a=u(c=>c.user),n=j(),o=b(),w=i(c=>{n(O({email:c.email,name:c.name,password:c.password}))});return x.useEffect(()=>{!(a!=null&&a.error)&&!(a!=null&&a.loading)&&(a!=null&&a.isOtpSent)&&o("/auth/otp/"+t("email"))},[a]),e.jsxs(e.Fragment,{children:[e.jsx(C,{children:e.jsx(k,{children:e.jsx(g,{className:"text-center",children:"Signup"})})}),e.jsx(P,{children:e.jsxs("form",{className:"flex flex-col gap-4",onSubmit:w,children:[e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"name",children:"Name"}),e.jsx(d,{...l("name",{required:"Name is required"}),id:"name",type:"text",placeholder:"Name",className:"w-full",autoComplete:"name"}),r.name&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:r.name.message})]}),e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"email",children:"Email"}),e.jsx(d,{...l("email",{required:"Email is required"}),id:"email",type:"email",placeholder:"Email",className:"w-full",autoComplete:"email"}),r.email&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:r.email.message})]}),e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"password",children:"Password"}),e.jsx(d,{...l("password",{required:"Password is required",pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,message:"Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character"}}),id:"password",type:"password",placeholder:"Password",className:"w-full",autoComplete:"new-password"}),r.password&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:r.password.message})]}),e.jsxs("div",{className:"flex flex-col gap-1 relative pb-4",children:[e.jsx(m,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(d,{...l("confirmPassword",{required:"Confirm Password is required",validate:c=>{if(c!==s("password"))return"Passwords do not match"}}),id:"confirmPassword",type:"password",placeholder:"Confirm Password",className:"w-full",autoComplete:"new-password"}),r.confirmPassword&&e.jsx("span",{className:"text-red-500 text-xs absolute bottom-0",children:r.confirmPassword.message})]}),e.jsx(h,{disabled:a==null?void 0:a.loading,type:"submit",className:"mt-2 px-4 flex items-center justify-center gap-2",children:e.jsx("span",{children:"Signup"})})]})}),e.jsx(F,{children:e.jsxs("div",{className:"text-center w-full text-black/70 dark:text-white/70",children:["already have an account?"," ",e.jsx(v,{to:"/auth/login",className:"text-blue-500",children:"Login"})]})})]})},Y=({logoSize:l,className:i,showLogo:t=!0,showText:s=!0})=>e.jsxs(g,{className:`text-3xl flex gap-2 items-center ${i}`,children:[t&&e.jsx(S,{size:l}),s&&e.jsx("span",{children:"Ref.com"})]}),N=({children:l})=>{const{theme:i}=B(),t=u(s=>s.user);return e.jsxs("div",{className:"h-screen overflow-hidden",children:[e.jsx("div",{className:"fixed top-0 left-0 m-4 z-20",children:e.jsx(v,{to:"/",className:"w-fit",children:e.jsx(Y,{className:""})})}),e.jsxs("div",{className:"relative flex justify-center items-center w-full h-full",children:[(t==null?void 0:t.loading)&&e.jsx("div",{className:"absolute w-full h-full bg-background/40 z-10",children:e.jsx(G,{className:"size-5 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2"})}),e.jsx(Z,{className:"max-w-96 w-full bg-transparent",children:l})]}),e.jsx("div",{className:"fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black",children:e.jsx("img",{src:"/backgrounds/auth-dark.jpg",className:`w-full h-full object-cover opacity-40 ${i==="dark"?"":"invert"}`})})]})},L=2.5*60,J=()=>{const{register:l,handleSubmit:i}=y(),t=D(),s=u(p=>p.user),r=j(),a=b(),[n,o]=x.useState(L);x.useEffect(()=>{if(n<=0)return;const p=setInterval(()=>{o(T=>T-1)},1e3);return()=>clearInterval(p)},[n]);const w=i(p=>{r(z({email:t.email,otp:p.otp}))}),c=()=>{r(I()).then(()=>{o(L)})};return x.useEffect(()=>{s.isAuthenticated&&a("/workspace")},[s.isAuthenticated]),e.jsxs(e.Fragment,{children:[e.jsx(C,{children:e.jsx(k,{children:e.jsx(g,{className:"text-center",children:"Signup"})})}),e.jsx(P,{children:e.jsxs("form",{className:"flex flex-col gap-6",onSubmit:w,children:[e.jsxs("p",{className:"text-center",children:["OTP sent to ",t.email]}),e.jsx(d,{...l("otp",{required:!0}),id:"otp",type:"text",placeholder:"OTP",className:"w-full",autoComplete:"name"}),e.jsxs("div",{className:"flex justify-center items-center gap-2",children:[e.jsx("span",{children:`${Math.floor(n/60)}:${(n%60).toString().padStart(2,"0")}`}),e.jsx(h,{disabled:(s==null?void 0:s.loading)||n>0,type:"button",variant:"link",onClick:c,className:s!=null&&s.loading||n>0?"":"hover:underline",children:"resend"})]}),e.jsx(h,{disabled:s==null?void 0:s.loading,type:"submit",className:"mt-2 px-4 flex items-center justify-center gap-2",children:e.jsx("span",{children:"Verify"})})]})})]})},_=()=>e.jsxs(V,{children:[e.jsx(f,{path:"login",element:e.jsx(N,{children:e.jsx(M,{})})}),e.jsx(f,{path:"signup",element:e.jsx(N,{children:e.jsx(U,{})})}),e.jsx(f,{path:"otp/:email",element:e.jsx(N,{children:e.jsx(J,{})})}),e.jsx(f,{path:"*",element:e.jsx($,{})})]});export{_ as default};
