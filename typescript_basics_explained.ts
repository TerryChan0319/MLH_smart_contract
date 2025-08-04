/**
 * TypeScript 基礎語法解釋 - 專為初學者設計
 * 讓我們一步一步拆解這個函數定義：
 * function twoSum(nums: number[], target: number): number[] {}
 */

console.log("=== TypeScript 基礎語法教學 ===\n");

// 🔤 第一部分：什麼是 number[]？
console.log("🔤 第一部分：什麼是 number[]？");
console.log("number[] 意思是「數字的陣列」");
console.log();

// 讓我們用例子來理解
console.log("📋 陣列就像一個清單：");
const myNumbers: number[] = [1, 2, 3, 4, 5];
console.log("myNumbers =", myNumbers);
console.log("這是一個裝了 5 個數字的陣列");
console.log();

console.log("🔍 陣列的特點：");
console.log("- 用 [] 方括號包起來");
console.log("- 裡面放很多個數字");
console.log("- 每個數字用逗號分開");
console.log("- 有順序，可以用位置找到每個數字");
console.log();

console.log("📍 位置（索引）的概念：");
console.log("陣列: [10, 20, 30, 40]");
console.log("位置:   0   1   2   3  (從 0 開始數)");
console.log("所以 myNumbers[0] = 10");
console.log("     myNumbers[1] = 20");
console.log("     myNumbers[2] = 30");
console.log();

// 🎯 第二部分：拆解函數定義
console.log("🎯 第二部分：拆解函數定義");
console.log("讓我們把這個函數定義拆成小塊：");
console.log("function twoSum(nums: number[], target: number): number[] {}");
console.log();

console.log("第1塊：function");
console.log("- 這是關鍵字，告訴電腦「我要定義一個函數」");
console.log("- 就像說「我要創造一個工具」");
console.log();

console.log("第2塊：twoSum");
console.log("- 這是函數的名字");
console.log("- 你可以叫它任何名字，比如 findTwoNumbers 或 solve");
console.log("- 建議用有意義的名字");
console.log();

console.log("第3塊：(nums: number[], target: number)");
console.log("- 這是「參數列表」，放在小括號 () 裡面");
console.log("- 參數就是這個函數需要的「材料」");
console.log("- 讓我們拆解這個參數列表：");
console.log();

console.log("  參數1：nums: number[]");
console.log("  - nums 是參數的名字（你可以改成別的）");
console.log("  - : 是分隔符號");
console.log("  - number[] 是類型，表示「數字陣列」");
console.log("  - 意思：這個函數需要一個數字陣列作為輸入");
console.log();

console.log("  參數2：target: number");
console.log("  - target 是參數的名字");
console.log("  - : 是分隔符號");
console.log("  - number 是類型，表示「一個數字」");
console.log("  - 意思：這個函數還需要一個數字作為目標");
console.log();

console.log("第4塊：: number[]");
console.log("- 這是「返回類型」");
console.log("- 冒號 : 後面說明這個函數會回傳什麼");
console.log("- number[] 表示會回傳一個數字陣列");
console.log("- 意思：這個函數執行完會給你一個數字陣列");
console.log();

console.log("第5塊：{}");
console.log("- 這是「函數體」，放在大括號 {} 裡面");
console.log("- 裡面寫實際的程式碼");
console.log("- 目前是空的，所以什麼都不做");
console.log();

// 🏗️ 第三部分：建造完整的函數
console.log("🏗️ 第三部分：建造完整的函數");
console.log("讓我們一步一步建造這個函數：");
console.log();

console.log("步驟1：寫函數框架");
console.log(`
function twoSum(nums: number[], target: number): number[] {
    // 這裡放程式碼
}
`);

console.log("步驟2：加上實際功能");
function twoSum(nums: number[], target: number): number[] {
    console.log("🔧 函數開始執行！");
    console.log(`  收到的數字陣列：[${nums.join(', ')}]`);
    console.log(`  收到的目標數字：${target}`);
    
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        console.log(`  檢查數字 ${nums[i]}，需要找 ${complement}`);
        
        if (map.has(complement)) {
            const result = [map.get(complement)!, i];
            console.log(`  ✅ 找到答案：[${result.join(', ')}]`);
            return result;
        }
        
        map.set(nums[i], i);
        console.log(`  💾 記住 ${nums[i]} 在位置 ${i}`);
    }
    
    return [];
}

console.log("步驟3：測試函數");
const testArray = [2, 7, 11, 15];
const testTarget = 9;
const result = twoSum(testArray, testTarget);
console.log(`最終結果：[${result.join(', ')}]`);
console.log();

// 🎓 第四部分：類型系統的好處
console.log("🎓 第四部分：類型系統的好處");
console.log("為什麼要寫 number[] 而不是直接寫 [] ？");
console.log();

console.log("✅ 好處1：防止錯誤");
console.log("如果你不小心傳入文字，TypeScript 會警告你");
console.log("例如：twoSum(['a', 'b'], 5) ← 這會報錯");
console.log();

console.log("✅ 好處2：自動提示");
console.log("當你打 nums. 時，編輯器會顯示陣列的所有方法");
console.log("例如：nums.length、nums.push()、nums.pop() 等");
console.log();

console.log("✅ 好處3：文檔化");
console.log("看到函數定義就知道要傳什麼、會得到什麼");
console.log("不用猜測或查看程式碼內容");
console.log();

// 🔍 第五部分：其他常見類型
console.log("🔍 第五部分：其他常見類型");
console.log("除了 number[]，還有很多其他類型：");
console.log();

console.log("基本類型：");
console.log("- number: 數字 (1, 2.5, -10)");
console.log("- string: 文字 ('hello', \"world\")");
console.log("- boolean: 布林值 (true, false)");
console.log();

console.log("陣列類型：");
console.log("- number[]: 數字陣列 [1, 2, 3]");
console.log("- string[]: 文字陣列 ['a', 'b', 'c']");
console.log("- boolean[]: 布林陣列 [true, false, true]");
console.log();

// 🎮 第六部分：練習時間
console.log("🎮 第六部分：練習時間");
console.log("讓我們看看其他函數的例子：");
console.log();

// 例子1：簡單的加法函數
function add(a: number, b: number): number {
    return a + b;
}
console.log("例子1：加法函數");
console.log("function add(a: number, b: number): number");
console.log("- 接收兩個數字");
console.log("- 回傳一個數字");
console.log(`測試：add(3, 5) = ${add(3, 5)}`);
console.log();

// 例子2：問候函數
function greet(name: string): string {
    return `Hello, ${name}!`;
}
console.log("例子2：問候函數");
console.log("function greet(name: string): string");
console.log("- 接收一個文字");
console.log("- 回傳一個文字");
console.log(`測試：greet('Alice') = "${greet('Alice')}"`);
console.log();

// 例子3：檢查是否為偶數
function isEven(num: number): boolean {
    return num % 2 === 0;
}
console.log("例子3：檢查偶數函數");
console.log("function isEven(num: number): boolean");
console.log("- 接收一個數字");
console.log("- 回傳一個布林值");
console.log(`測試：isEven(4) = ${isEven(4)}`);
console.log(`測試：isEven(5) = ${isEven(5)}`);
console.log();

// 🏆 總結
console.log("🏆 總結");
console.log("function twoSum(nums: number[], target: number): number[] {}");
console.log();
console.log("完整解釋：");
console.log("「創造一個叫做 twoSum 的函數，");
console.log(" 它需要一個數字陣列叫 nums，");
console.log(" 和一個數字叫 target，");
console.log(" 執行完後會回傳一個數字陣列」");
console.log();
console.log("🎯 記住這個模式：");
console.log("function 函數名(參數名: 類型): 回傳類型 { 程式碼 }");
console.log();
console.log("🎉 現在你完全理解函數定義了！");