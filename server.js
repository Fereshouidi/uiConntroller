import express from 'express';
import cors from 'cors';
import Gemini from './gemini.js';

const app = express();
const port = 3004 | process.env.PORT;
app.use(express.json());
app.use(cors());


// const promptForAgent = `انت الان تعمل في فندق حيث يتولى ادارة بالكامل عدة نماذج ذكاء اصطناعي
// أنت نظام حجوزات فندق الباش الذكي. اتبع هذه القواعد بدقة:

// **هيكل الردود الإلزامي:**
// رسالة الضيف
// [SEPARATION]
// [الرموز الوظيفية] + [البيانات النظامية]

// **الرموز الوظيفية:**
// - h4h4 ← اكتمال التحقق بنجاح (يأتي أولًا بعد الفاصل)
// - rlrl ← لغة الرد عربية
// - lrlr ← لغة الرد غير عربية

// مهمتك هي التحدث بلباقة مع العملاء و حجز غرف لهم و ذلك بعض حصولك على هذه البيانات 
// -السم الكامل )يجب ان يتكون من كلمتين او اكثر(
// -تاريخ الولادة 
// - مدة البقاء 
// -البريد الالكتروني
// -رقم الهاتف )يجب ان يكون مصحوب برمز الدولة 

// ملاحظة ) كن صارما في اخذ البيانات كما هي مطلوبة(

// بعد ان تأخذ من العميل تلك البيانات قم اعطاءه رقم غرفة و مفتاح )كلمة مرور( ثم قم بصياغتها في شكل json بهذا الشكل بالضبط مع احترام اسماء المفاتيح و نوع البيانات التي يأخذها كل مفتاح 
// {
//   "fullName": type string,
//     "dateOfBirth": type date,
//   "stayDuration": type number,
//   "email": type string,
//   "phone": type string,
//   "roomNumber": type string,
//   "key": type string
// }

// عندما تجتمع عندك كل البيانات قم بكتابتها اسفل [SEPARATION] و ضع قبلها الرمز h4h4 كدلالة على اكتمال جمع البيانات من العميل 

// ثم قم بتقديم رقم الغرفة و المفتاح للعميل و اوصيه بالا يظيع المفتاح

// ملاحظة - في كل رسالة تكتبها يجب ارفاقها برمز اللغة 
// - تجنب استخدام تلك الرموز في اي سياقات اخرى 
// - تحدث مع العميل بلباقة و ترحيب و باللغة التي يخاطبك بها
// - لا تقدم البيانات للعميل الا اذا طلب منك ذلك و لا تقدمها له في شكل json بل فقط في شكل نص مفهوم للبشر
// - رسائلك سيتم تحليلها من قبل ذكاء اصطناعي اخر بحيث سيقسمها ال جزئين ) رسالة للعميل و قسم به رموز ( و سيستعين بكلمة [SEPARATION] لتحديد القسمين بحيث سيتم بعدها ارسال القسم القسم الخاص برسالة العميل الى العميل و سيتم استخدام القسم الخاص بالرموز للتعامل مع نماذج ذكاء اصطناعي اخرى لذا ركز فيما تكتبه للعميل ) لا يجب كتابة اي نوع من الامور المعقدة التي لا يفهمها الانسان العادي( و حاول ان تكون حذرا في بنية الرسالة فاي خطأ بسيط قد يسبب مشاكل
// - مهم جدا كتابة البيانات في قسم الرموز اسفل [SEPARATION]عندما تجتمع بشكل كامل . نسيان ذلك سيسبب مشاكل 
// `;

// const gemini = new Gemini(promptForAgent);
// const datacollectorAgent = new Gemini(`
//     أنت الآن تعمل في فندق تديره بالكامل نماذج ذكاء اصطناعي. مهمتك هي تلقي رسالة من نموذج ذكاء اصطناعي آخر تحتوي على بيانات العميل، وقد تتضمن الرسالة كلامًا موجهًا للعميل أو رموزًا أخرى لا تهمك. مهمتك هنا هي استخراج البيانات وكتابتها في شكل كائن JSON صالح، مع التأكد من أن الرسالة التي تُرجعها تحتوي فقط على الكائن JSON دون أي نص إضافي.

// **تعليمات صارمة:**
// 1. يجب أن تبدأ رسالتك بـ '{' وتنتهي بـ '}' في نفس السطر، دون أي أحرف إضافية خارج '{}' (لا نصوص، لا تعليقات، لا كلمة "json"، لا مسافات قبل أو بعد).
// 2. الكائن يجب أن يكون بالشكل التالي بالضبط:
//    {
//      "fullName": string,
//      "dateOfBirth": string,
//      "stayDuration": number,
//      "email": string,
//      "phone": string,
//      "roomNumber": string,
//      "key": string
//    }
//    - احترم أسماء المفاتيح وأنواع البيانات (مثل: "stayDuration" يجب أن يكون رقمًا، وليس نصًا).
// 3. لا تضف أي حقول إضافية غير المذكورة أعلاه.
// 4. إذا كانت البيانات في الرسالة لا تتطابق مع التنسيق المطلوب (مثل أنواع بيانات خاطئة أو حقول مفقودة)، قم بإرجاع كائن فارغ "{}".
// 5. رسالتك ستُستخدم في كود JavaScript كالتالي: "objectData = JSON.parse(yourMessage);"، لذا يجب أن تكون سلسلة JSON صالحة.

// **مثال لرسالة ناجحة:**
// {"fullName":"فارس مولود","dateOfBirth":"2003-10-12","stayDuration":7,"email":"fareshouidi@","phone":"+21629165922","roomNumber":"204","key":"AX59ZW"}

// **أمثلة خاطئة (لا تفعل هذا):**
// - {"fullName":"فارس"} ← ناقص حقول
// - json\n{"fullName":"فارس"} ← يحتوي على نص إضافي
// - {"stayDuration":"7"} ← stayDuration يجب أن يكون رقمًا وليس نصًا
// `);

// const principalChat = gemini.addChat();
// const chat = datacollectorAgent.addChat(); 

// console.log(principalChat);


const websiteAssistantPrompt = `You are an assistant for an anonymous website. Your ONLY task is to:  
1. Chat with users about modifying the VISUAL APPEARANCE of the body section  
2. Format responses EXACTLY like this:  

[Your response to user]  
<seperation>  
[Modified BODY HTML ONLY]  

RULES:  
- NEVER modify head/style/script - ONLY body content  
- Keep original classes/IDs/structure unless explicitly asked  
- ALWAYS maintain the separation tag exactly as shown  
- Changes must be visible in these elements:  
  • .container (main layout)  
  • .shapes (.square, .circle, .triangle)  
  • .input-container (text input + button)  
  • .toggle-switch (dark mode button)  

EXAMPLE 1 - Valid response:  
"تم تغيير لون الخلفية إلى الأزرق بنجاح!"  
<seperation>  
<body>  
    <div class="container" style="background: blue">  
        <!-- Rest of original body content -->  
    </div>  
</body>  

EXAMPLE 2 - Valid response:  
"تم تكبير حجم الأشكال بنسبة 50%"  
<seperation>  
<body>  
    <div class="container">  
        <div class="shapes">  
            <div class="square" style="width: 90px; height: 90px"></div>  
            <div class="circle" style="width: 90px; height: 90px"></div>  
            <div class="triangle" style="border-bottom-width: 90px"></div>  
        </div>  
        <!-- Rest of original body content -->  
    </div>  
</body>  

BAD EXAMPLE - Invalid:  
"تم التعديل"  
<body>...</body>  
// Missing separation tag & modified head content  

With every modification you make, keep the updated version of the code for ongoing updates, so that you will modify the last code you provided to the client with every update he requests from you.

Current Body Structure to Modify:  

<body id="body">
    <div class="container">

        <p id="p"></p>
        <div class="toggle-switch" onclick="toggleDarkMode()"></div>
        <div class="shapes">
            <div class="square"></div>
            <div class="circle"></div>
            <div class="triangle"></div>
        </div>
        <div class="input-container">
            <input type="text" id="message" placeholder="أدخل رسالة...">
            <button onclick="send()">إرسال</button>
        </div>
    </div>
    
    <script>
        function toggleDarkMode() {
            document.body.classList.toggle("dark-mode");
        }
        function sendMessage() {
            let message = document.getElementById("message").value;
            alert("تم الإرسال: " + message);
        }

        const url = 'https://ui-conntroller.vercel.app';

        const send = async () => {
            const inputMessage = document.getElementById('message').value;
            try {
                const response = await fetch(url + '/edit/website', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userMSG: inputMessage 
                    })
                });

                if (!response.ok) {
                    throw new Error('error');
                }

                const data = await response.json();
                console.log(data.messageForUser);
                const dody = document.getElementById('body');
                body.innerHTML = data.newBody; 
                const p = document.getElementById('p');
                p.innerText = data.messageForUser; 
                
            } catch (err) {
                console.error('Error:', err);
                throw err;
            }
        }
    </script>


</body>
  
`;  
const frontEndAgent = new Gemini(websiteAssistantPrompt);
const chat1 = frontEndAgent.addChat();


// app.post('/send', async (req, res) => {
//     const { userMSG } = req.body;
    
//     try {
//         const geminiAnswer = await gemini.getGeminiAnswer(principalChat, userMSG);

//         if (geminiAnswer.includes('h4h4')) {

//             const data = await datacollectorAgent.getGeminiAnswer(chat, geminiAnswer);            

//             let objectData = {}
//             try {
//                 objectData = JSON.parse(data); 
//             } catch (err) {
//                 console.log('this is not a valid object !', data);
//             }
//             console.log(objectData);
//             console.log(objectData.fullName);
            
//         }
//         res.send(geminiAnswer);

//     } catch (err) {
//         console.log(err);
//         res.send(err);
//     }
// })

app.post('/edit/website', async (req, res) => {

    const { userMSG } = req.body;        

    try {
        
        const geminiAnswer = await frontEndAgent.getGeminiAnswer(chat1, userMSG);

        const separatorIndex = geminiAnswer.indexOf('<seperation>');
        if (separatorIndex === -1) {
            throw new Error('Invalid response format: missing <seperation> tag');
        }

        console.log(geminiAnswer);


        const messageForUser = geminiAnswer.slice(0, separatorIndex).trim();
        const newBody = geminiAnswer.slice(separatorIndex + '<seperation>'.length).trim();

        console.log({messageForUser, newBody});

        res.send({messageForUser, newBody});

    } catch (err) {
        console.log(err);
        res.send(err);
    }
})


app.listen(port, () => {
    console.log('server wort at the port ', port);
})