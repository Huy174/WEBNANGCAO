import {useState} from "react";
function ChangeTitle(){
    const [title, setTitle] = useState("Website Tin Tức");
    return(
        <div>
            <h2>{title}</h2>
            <button onClick={()=> setTitle("Tin công nghệ")}>Tin công nghệ</button>
            <button onClick={()=> setTitle("Tin thể thao")}>Tin thể thao</button>
            <button onClick={()=> setTitle("Tin giáo dục")}>Tin giáo dục</button>
        </div>
    )
}
export default ChangeTitle;