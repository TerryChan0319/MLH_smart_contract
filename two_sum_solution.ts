/**
 * Two Sum Problem Solutions (TypeScript)
 * 給定一個整數數組 nums 和一個整數 target，返回兩個數字的索引，使得它們相加等於 target。
 * 
 * 問題分析：
 * - 需要找到兩個數字的索引，使得 nums[i] + nums[j] = target
 * - 每個輸入只有一個解
 * - 不能使用同一個元素兩次
 * - 可以以任何順序返回答案
 */

/**
 * 方法1: 暴力解法 (Brute Force)
 * 時間複雜度: O(n²)
 * 空間複雜度: O(1)
 * 
 * 思路：
 * - 使用兩層嵌套循環
 * - 外層循環遍歷每個元素
 * - 內層循環檢查剩餘元素是否與當前元素相加等於 target
 */
function twoSumBruteForce(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return []; // 如果沒有找到解（理論上不會發生）
}

/**
 * 方法2: 哈希表解法 (Hash Map) - 推薦解法
 * 時間複雜度: O(n)
 * 空間複雜度: O(n)
 * 
 * 思路：
 * - 使用 Map 存儲已遍歷的元素值和索引
 * - 對於每個元素，計算 complement = target - nums[i]
 * - 檢查 complement 是否在 Map 中
 * - 如果存在，返回當前索引和 complement 的索引
 * - 如果不存在，將當前元素加入 Map
 */
function twoSum(nums: number[], target: number): number[] {
    const hashMap = new Map<number, number>(); // 存儲 {值: 索引}
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // 檢查 complement 是否已經在 hashMap 中
        if (hashMap.has(complement)) {
            return [hashMap.get(complement)!, i];
        }
        
        // 將當前數字和索引加入 hashMap
        hashMap.set(nums[i], i);
    }
    
    return []; // 如果沒有找到解（理論上不會發生）
}

/**
 * 方法3: 使用 Object 作為哈希表
 * 時間複雜度: O(n)
 * 空間複雜度: O(n)
 * 
 * 使用普通物件代替 Map，在某些情況下可能更快
 */
function twoSumWithObject(nums: number[], target: number): number[] {
    const hashMap: { [key: number]: number } = {}; // 存儲 {值: 索引}
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // 檢查 complement 是否已經在 hashMap 中
        if (complement in hashMap) {
            return [hashMap[complement], i];
        }
        
        // 將當前數字和索引加入 hashMap
        hashMap[nums[i]] = i;
    }
    
    return []; // 如果沒有找到解（理論上不會發生）
}

/**
 * 方法4: 兩次遍歷哈希表
 * 時間複雜度: O(n)
 * 空間複雜度: O(n)
 * 
 * 思路：
 * - 第一次遍歷：將所有元素加入哈希表
 * - 第二次遍歷：查找每個元素的 complement
 */
function twoSumTwoPass(nums: number[], target: number): number[] {
    const hashMap = new Map<number, number>();
    
    // 第一次遍歷：建立哈希表
    for (let i = 0; i < nums.length; i++) {
        hashMap.set(nums[i], i);
    }
    
    // 第二次遍歷：查找 complement
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (hashMap.has(complement) && hashMap.get(complement) !== i) {
            return [i, hashMap.get(complement)!];
        }
    }
    
    return [];
}

// 定義測試案例的型別
interface TestCase {
    nums: number[];
    target: number;
    expected: number[];
    description: string;
}

// 定義解法函數的型別
type SolutionFunction = (nums: number[], target: number) => number[];

/**
 * 測試所有解法
 */
function testSolutions(): void {
    const testCases: TestCase[] = [
        {
            nums: [2, 7, 11, 15],
            target: 9,
            expected: [0, 1],
            description: "基本案例"
        },
        {
            nums: [3, 2, 4],
            target: 6,
            expected: [1, 2],
            description: "不是前兩個元素"
        },
        {
            nums: [3, 3],
            target: 6,
            expected: [0, 1],
            description: "重複元素"
        },
        {
            nums: [-1, -2, -3, -4, -5],
            target: -8,
            expected: [2, 4],
            description: "負數"
        },
        {
            nums: [0, 4, 3, 0],
            target: 0,
            expected: [0, 3],
            description: "包含零"
        }
    ];
    
    const solutions: [string, SolutionFunction][] = [
        ["暴力解法", twoSumBruteForce],
        ["哈希表解法 (Map)", twoSum],
        ["哈希表解法 (Object)", twoSumWithObject],
        ["兩次遍歷", twoSumTwoPass]
    ];
    
    testCases.forEach(({ nums, target, expected, description }) => {
        console.log(`\n測試案例: ${description}`);
        console.log(`nums = [${nums.join(', ')}], target = ${target}`);
        console.log(`期望結果: [${expected.join(', ')}]`);
        
        solutions.forEach(([name, solution]) => {
            const result = solution([...nums], target); // 複製數組避免修改原始數據
            
            // 檢查結果是否正確（可能順序不同）
            const isCorrect = (
                result.length === 2 && 
                nums[result[0]] + nums[result[1]] === target &&
                result[0] !== result[1]
            );
            
            const status = isCorrect ? "✓" : "✗";
            console.log(`${status} ${name}: [${result.join(', ')}]`);
        });
    });
}

/**
 * 性能測試
 */
function performanceTest(): void {
    console.log("\n=== 性能測試 ===");
    
    // 生成大數組進行性能測試
    const largeNums = Array.from({ length: 10000 }, (_, i) => i);
    const target = 9999 + 9998; // 倒數第二和第三個元素的和
    
    const solutions: [string, SolutionFunction][] = [
        ["哈希表解法 (Map)", twoSum],
        ["哈希表解法 (Object)", twoSumWithObject],
        // 不測試暴力解法，因為會很慢
    ];
    
    solutions.forEach(([name, solution]) => {
        const startTime = performance.now();
        const result = solution([...largeNums], target);
        const endTime = performance.now();
        
        console.log(`${name}: ${(endTime - startTime).toFixed(2)}ms, 結果: [${result.join(', ')}]`);
    });
}

// 主程序
function main(): void {
    console.log("=== Two Sum 問題解法比較 (TypeScript) ===");
    
    // 運行測試
    testSolutions();
    
    // 性能測試
    performanceTest();
    
    console.log("\n=== 解法分析 ===");
    console.log("1. 暴力解法:");
    console.log("   - 時間複雜度: O(n²)");
    console.log("   - 空間複雜度: O(1)");
    console.log("   - 適用於小數據集");
    
    console.log("\n2. 哈希表解法 (Map) - 推薦:");
    console.log("   - 時間複雜度: O(n)");
    console.log("   - 空間複雜度: O(n)");
    console.log("   - 最優解法，滿足 follow-up 要求");
    console.log("   - 只需要一次遍歷");
    console.log("   - 使用 ES6 Map，類型安全");
    
    console.log("\n3. 哈希表解法 (Object):");
    console.log("   - 時間複雜度: O(n)");
    console.log("   - 空間複雜度: O(n)");
    console.log("   - 使用普通物件，可能在某些引擎上更快");
    
    console.log("\n4. 兩次遍歷:");
    console.log("   - 時間複雜度: O(n)");
    console.log("   - 空間複雜度: O(n)");
    console.log("   - 概念清晰，但效率略低");
    
    console.log("\n=== TypeScript 特色 ===");
    console.log("• 靜態類型檢查，減少運行時錯誤");
    console.log("• 明確的函數簽名和返回類型");
    console.log("• 介面定義增強代碼可讀性");
    console.log("• 編譯時優化和錯誤檢測");
}

// 執行主程序
if (require.main === module) {
    main();
}

// 導出主要函數供其他模組使用
export {
    twoSum,
    twoSumBruteForce,
    twoSumWithObject,
    twoSumTwoPass
};