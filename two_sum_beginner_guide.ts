/**
 * Two Sum 問題 - 初學者完全指南
 * 
 * 🎯 問題：給定一個數字陣列和一個目標數字，找到兩個數字的位置，使得它們相加等於目標數字
 * 
 * 例如：陣列 [2, 7, 11, 15]，目標是 9
 * 答案：位置 0 和 1，因為 2 + 7 = 9
 */

console.log("=== Two Sum 初學者教學 ===\n");

// 📚 第一步：理解問題
console.log("📚 第一步：理解問題");
console.log("問題：在陣列中找到兩個數字，它們相加等於目標數字");
console.log("要求：返回這兩個數字的位置（索引）");
console.log("限制：每個數字只能用一次\n");

// 🔍 第二步：用簡單例子理解
console.log("🔍 第二步：用簡單例子理解");
const example = [2, 7, 11, 15];
const target = 9;
console.log(`陣列: [${example.join(', ')}]`);
console.log(`目標: ${target}`);
console.log("我們要找的是：哪兩個數字相加等於 9？");
console.log("答案：2 + 7 = 9");
console.log("位置：2 在位置 0，7 在位置 1");
console.log("所以返回 [0, 1]\n");

// 💭 第三步：思考解法
console.log("💭 第三步：思考解法");
console.log("方法1 - 暴力解法（簡單但慢）：");
console.log("- 試試每一對數字的組合");
console.log("- 看看它們相加是否等於目標");
console.log();
console.log("方法2 - 聰明解法（快速）：");
console.log("- 對於每個數字，計算需要找的另一個數字");
console.log("- 用「記憶」來記住之前看過的數字");
console.log("- 如果找到需要的數字，就完成了！\n");

// 🚀 第四步：實作暴力解法（容易理解）
console.log("🚀 第四步：實作暴力解法（容易理解）");

function twoSumSimple(nums: number[], target: number): number[] {
    console.log(`\n開始尋找相加等於 ${target} 的兩個數字...`);
    
    // 外層循環：選擇第一個數字
    for (let i = 0; i < nums.length; i++) {
        console.log(`\n選擇第一個數字：nums[${i}] = ${nums[i]}`);
        
        // 內層循環：選擇第二個數字
        for (let j = i + 1; j < nums.length; j++) {
            console.log(`  試試第二個數字：nums[${j}] = ${nums[j]}`);
            console.log(`  計算：${nums[i]} + ${nums[j]} = ${nums[i] + nums[j]}`);
            
            if (nums[i] + nums[j] === target) {
                console.log(`  ✅ 找到了！${nums[i]} + ${nums[j]} = ${target}`);
                console.log(`  答案是位置 [${i}, ${j}]`);
                return [i, j];
            } else {
                console.log(`  ❌ 不等於 ${target}，繼續找...`);
            }
        }
    }
    
    return []; // 沒找到（但題目保證有答案）
}

console.log("讓我們用暴力解法試試看：");
const result1 = twoSumSimple([2, 7, 11, 15], 9);
console.log(`\n暴力解法結果：[${result1.join(', ')}]\n`);

// ⭐ 第五步：理解聰明解法的概念
console.log("⭐ 第五步：理解聰明解法的概念");
console.log("聰明解法的核心思想：");
console.log("1. 對於每個數字 x，我們要找的是 (target - x)");
console.log("2. 如果我們之前見過 (target - x)，就找到答案了！");
console.log("3. 用「哈希表」來記住見過的數字和它們的位置\n");

console.log("舉例說明：");
console.log("陣列：[2, 7, 11, 15]，目標：9");
console.log("步驟1：看到數字 2（位置0），需要找 9-2=7，但還沒見過7");
console.log("步驟2：看到數字 7（位置1），需要找 9-7=2，之前見過2在位置0！");
console.log("步驟3：找到答案 [0, 1]\n");

// 🎯 第六步：實作聰明解法（詳細解釋）
console.log("🎯 第六步：實作聰明解法（詳細解釋）");

function twoSumSmart(nums: number[], target: number): number[] {
    console.log(`\n開始用聰明方法尋找相加等於 ${target} 的兩個數字...`);
    
    // 創建一個「記憶」來記住見過的數字
    const memory = new Map<number, number>(); // 記住：數字 -> 位置
    console.log("創建記憶庫（哈希表）來記住見過的數字");
    
    for (let i = 0; i < nums.length; i++) {
        const currentNumber = nums[i];
        const needToFind = target - currentNumber;
        
        console.log(`\n步驟 ${i + 1}:`);
        console.log(`  當前數字：${currentNumber} (位置 ${i})`);
        console.log(`  需要找到：${target} - ${currentNumber} = ${needToFind}`);
        
        // 檢查記憶中是否有我們需要的數字
        if (memory.has(needToFind)) {
            const foundPosition = memory.get(needToFind)!;
            console.log(`  ✅ 在記憶中找到了 ${needToFind}！它在位置 ${foundPosition}`);
            console.log(`  答案：[${foundPosition}, ${i}]`);
            console.log(`  驗證：${nums[foundPosition]} + ${nums[i]} = ${nums[foundPosition] + nums[i]}`);
            return [foundPosition, i];
        } else {
            console.log(`  ❌ 記憶中沒有 ${needToFind}`);
            console.log(`  把 ${currentNumber} 記在位置 ${i}`);
            memory.set(currentNumber, i);
            
            // 顯示目前記憶的內容
            console.log(`  目前記憶：`, Array.from(memory.entries()).map(([num, pos]) => `${num}在位置${pos}`).join(', '));
        }
    }
    
    return [];
}

console.log("讓我們用聰明解法試試看：");
const result2 = twoSumSmart([2, 7, 11, 15], 9);
console.log(`\n聰明解法結果：[${result2.join(', ')}]\n`);

// 📊 第七步：比較兩種方法
console.log("📊 第七步：比較兩種方法");
console.log("暴力解法：");
console.log("✅ 優點：容易理解，直觀");
console.log("❌ 缺點：慢，需要檢查所有組合");
console.log("⏱️  時間：如果有 n 個數字，需要檢查 n×(n-1)/2 次");
console.log();
console.log("聰明解法（哈希表）：");
console.log("✅ 優點：快速，只需要看每個數字一次");
console.log("❌ 缺點：需要額外記憶空間");
console.log("⏱️  時間：如果有 n 個數字，只需要看 n 次");
console.log();

// 🎮 第八步：互動練習
console.log("🎮 第八步：互動練習");

function practiceExample(nums: number[], target: number, description: string): void {
    console.log(`\n練習：${description}`);
    console.log(`陣列：[${nums.join(', ')}]，目標：${target}`);
    console.log("請先自己想想答案，然後看下面的解答過程：");
    
    const result = twoSumSmart(nums, target);
    console.log(`最終答案：[${result.join(', ')}]`);
    
    if (result.length === 2) {
        console.log(`驗證：${nums[result[0]]} + ${nums[result[1]]} = ${nums[result[0]] + nums[result[1]]} ✅`);
    }
}

practiceExample([3, 2, 4], 6, "找兩個數字相加等於6");
practiceExample([3, 3], 6, "陣列中有重複數字");
practiceExample([1, 5, 3, 7, 9], 12, "較大的陣列");

// 🏆 第九步：最終版本（簡潔版）
console.log("\n🏆 第九步：最終版本（簡潔版）");
console.log("現在你理解了原理，這是最簡潔的版本：");

function twoSumFinal(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

console.log(`
function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
`);

// 💡 第十步：重要概念總結
console.log("💡 第十步：重要概念總結");
console.log("🔑 關鍵概念：");
console.log("1. 哈希表（Map）：快速查找的神器");
console.log("2. 時間複雜度：O(n) vs O(n²)");
console.log("3. 空間換時間：用記憶體換取速度");
console.log("4. 補數概念：target - current = needed");
console.log();
console.log("🎯 解題步驟：");
console.log("1. 理解問題要求");
console.log("2. 想出暴力解法");
console.log("3. 找出優化方向");
console.log("4. 實作優化解法");
console.log("5. 測試和驗證");
console.log();
console.log("🚀 這個問題教會我們：");
console.log("- 如何分析問題");
console.log("- 如何優化算法");
console.log("- 哈希表的威力");
console.log("- 編程思維的重要性");

console.log("\n🎉 恭喜！你已經完全理解了 Two Sum 問題！");