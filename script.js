
// ================================================
// SMART SHOPPING BUDGET OPTIMIZER
// Mathematical Working for All Four Algorithms
// ================================================

const products = [
    { name: "Laptop Bag", price: 1500, value: 80 },
    { name: "Headphones", price: 2000, value: 90 },
    { name: "Shoes", price: 2500, value: 100 },
    { name: "Watch", price: 1000, value: 50 },
    { name: "Keyboard", price: 1200, value: 70 }
];

let currentBudget = 5000;
let algorithmResults = {};

// ================================================
// COMMON FUNCTIONS
// ================================================

function money(n) {
    return "₹" + n.toLocaleString("en-IN");
}

function names(items) {
    return items.length
        ? items.map(p => p.name).join(" + ")
        : "No products";
}

function sumPrice(items) {
    return items.reduce((s, p) => s + p.price, 0);
}

function sumValue(items) {
    return items.reduce((s, p) => s + p.value, 0);
}

function makeResult(name, selected, steps) {
    const cost = sumPrice(selected);

    return {
        algorithm: name,
        selected,
        totalCost: cost,
        totalValue: sumValue(selected),
        remaining: currentBudget - cost,
        steps
    };
}

function step(title, content) {
    return `
        <div class="step">
            <strong>${title}</strong>
            <div style="margin-top:10px;line-height:1.9">
                ${content}
            </div>
        </div>
    `;
}

function calculation(title, formula, answer) {
    return `
        <div style="
            background:#10162b;
            padding:13px;
            margin:9px 0;
            border-radius:8px;
            border-left:3px solid #a886f4;
        ">
            <strong>${title}</strong>
            <div style="font-family:monospace;margin-top:7px">
                ${formula}
            </div>
            <div style="color:#c4a5ff;margin-top:5px">
                ${answer}
            </div>
        </div>
    `;
}

function subsetTable(subsets) {
    return `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Combination</th>
                        <th>Price Calculation</th>
                        <th>Total Price</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${subsets.map(s => `
                        <tr>
                            <td>${names(s.selected)}</td>
                            <td>${s.selected.length
                                ? s.selected.map(p => p.price).join(" + ")
                                : "0"}</td>
                            <td>${money(s.cost)}</td>
                            <td>${s.value}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function displayProducts() {
    document.getElementById("productList").innerHTML =
        products.map(p => `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p>Price: ${money(p.price)}</p>
                <p>Value Score: ${p.value}</p>
            </div>
        `).join("");
}

// ================================================
// 1. BRUTE FORCE
// ================================================

function bruteForce() {
    const steps = [];
    const n = products.length;

    let bestProducts = [];
    let bestValue = 0;
    let allCombinations = [];

    // Step 1: Number of combinations
    const totalCombinations = 2 ** n;

    steps.push(step(
        "Step 1: Calculate total combinations",
        calculation(
            "Formula",
            "Total combinations = 2ⁿ",
            `= 2⁵ = ${totalCombinations} combinations`
        ) +
        "Each product has two choices: include (1) or exclude (0)."
    ));

    // Step 2: Generate every combination
    for (let mask = 0; mask < totalCombinations; mask++) {
        let selected = [];

        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                selected.push(products[i]);
            }
        }

        const cost = sumPrice(selected);
        const value = sumValue(selected);

        const feasible = cost <= currentBudget;

        allCombinations.push({
            selected,
            cost,
            value,
            feasible
        });

        if (feasible && value > bestValue) {
            bestValue = value;
            bestProducts = [...selected];
        }
    }

    // Display all combinations
    steps.push(step(
        "Step 2: Generate and calculate all combinations",
        `<p>The algorithm generates all ${totalCombinations} combinations.</p>
         <p>For every combination:</p>
         <p>Total Price = Sum of product prices</p>
         <p>Total Value = Sum of product values</p>
         ${subsetTable(allCombinations.map(s => ({
             selected: s.selected,
             cost: s.cost,
             value: s.value
         })))}`
    ));

    // Step 3: Check feasibility
    const feasibleCount = allCombinations.filter(
        c => c.feasible
    ).length;

    steps.push(step(
        "Step 3: Check budget constraint",
        calculation(
            "Budget condition",
            "Total Price ≤ Budget",
            `${money(bestProducts.length ? currentBudget : currentBudget)}`
        ) +
        `<p>Feasible combinations: ${feasibleCount}</p>
         <p>Infeasible combinations: ${totalCombinations - feasibleCount}</p>
         <p>Combinations exceeding ${money(currentBudget)} are rejected.</p>`
    ));

    // Step 4: Best combination
    steps.push(step(
        "Step 4: Find maximum value",
        calculation(
            "Selected combination",
            names(bestProducts),
            `Total Value = ${bestValue}`
        ) +
        calculation(
            "Verify total price",
            bestProducts.map(p => p.price).join(" + "),
            `= ${money(sumPrice(bestProducts))} ≤ ${money(currentBudget)}`
        )
    ));

    return makeResult("Brute Force", bestProducts, steps);
}

// ================================================
// 2. DIVIDE AND CONQUER
// MEET-IN-THE-MIDDLE
// ================================================

function generateSubsets(items) {
    const result = [];

    for (let mask = 0; mask < 2 ** items.length; mask++) {
        const selected = [];

        for (let i = 0; i < items.length; i++) {
            if (mask & (1 << i)) {
                selected.push(items[i]);
            }
        }

        result.push({
            selected,
            cost: sumPrice(selected),
            value: sumValue(selected)
        });
    }

    return result;
}

function divideAndConquer() {
    const steps = [];

    // Step 1: Divide
    const middle = Math.floor(products.length / 2);

    const groupA = products.slice(0, middle);
    const groupB = products.slice(middle);

    steps.push(step(
        "Step 1: Divide the products",
        `<p>Number of products = ${products.length}</p>
         <p>Group A = ${names(groupA)}</p>
         <p>Group B = ${names(groupB)}</p>
         <p>Products are divided into two smaller groups.</p>`
    ));

    // Step 2: Generate subsets
    const subsetsA = generateSubsets(groupA);
    const subsetsB = generateSubsets(groupB);

    steps.push(step(
        "Step 2: Generate subsets",
        `<p>Group A subsets = 2² = ${subsetsA.length}</p>
         ${subsetTable(subsetsA)}
         <p>Group B subsets = 2³ = ${subsetsB.length}</p>
         ${subsetTable(subsetsB)}`
    ));

    // Step 3: Sort Group B
    subsetsB.sort((a, b) => a.cost - b.cost);

    steps.push(step(
        "Step 3: Sort Group B by price",
        `<p>Subsets are arranged from lowest to highest price.</p>
         ${subsetTable(subsetsB)}`
    ));

    // Step 4: Prefix best
    const prefixBest = [];
    let bestIndex = 0;

    for (let i = 0; i < subsetsB.length; i++) {
        if (subsetsB[i].value > subsetsB[bestIndex].value) {
            bestIndex = i;
        }

        prefixBest[i] = bestIndex;
    }

    steps.push(step(
        "Step 4: Build prefix-best values",
        `<p>At each position, store the index of the highest-value subset seen so far.</p>
         <p>This allows us to quickly select the best affordable Group B subset.</p>`
    ));

    // Step 5: Binary search
    let bestValue = 0;
    let bestLeft = null;
    let bestRight = null;
    let searchCalculations = [];

    for (const left of subsetsA) {
        const remaining = currentBudget - left.cost;

        if (remaining < 0) {
            searchCalculations.push(
                `${names(left.selected)}: ${money(left.cost)} exceeds the budget. Skipped.`
            );
            continue;
        }

        let low = 0;
        let high = subsetsB.length - 1;
        let answer = -1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            if (subsetsB[mid].cost <= remaining) {
                answer = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        if (answer >= 0) {
            const right = subsetsB[prefixBest[answer]];
            const combinedValue = left.value + right.value;
            const combinedCost = left.cost + right.cost;

            searchCalculations.push(`
                <p><strong>${names(left.selected)}</strong></p>
                Remaining = ${money(currentBudget)} - ${money(left.cost)}
                = ${money(remaining)}<br>
                Best matching Group B = ${names(right.selected)}<br>
                Combined price = ${money(combinedCost)}<br>
                Combined value = ${left.value} + ${right.value}
                = ${combinedValue}
            `);

            if (combinedCost <= currentBudget && combinedValue > bestValue) {
                bestValue = combinedValue;
                bestLeft = left;
                bestRight = right;
            }
        }
    }

    steps.push(step(
        "Step 5: Binary search and combine",
        `<p>For every Group A subset, calculate the remaining budget and use binary search to find the most expensive affordable Group B subset. The prefix-best array identifies the highest-value option.</p>
         ${searchCalculations.join("<hr style='border-color:#343b5d;margin:12px 0'>")}`
    ));

    const selected = [
        ...(bestLeft ? bestLeft.selected : []),
        ...(bestRight ? bestRight.selected : [])
    ];

    steps.push(step(
        "Step 6: Final result",
        calculation(
            "Combined products",
            names(selected),
            `Total Value = ${sumValue(selected)}`
        ) +
        calculation(
            "Total price",
            selected.map(p => p.price).join(" + "),
            `${money(sumPrice(selected))} ≤ ${money(currentBudget)}`
        )
    ));

    return makeResult("Meet-in-the-Middle", selected, steps);
}

// ================================================
// 3. DYNAMIC PROGRAMMING
// ================================================

function dynamicProgramming() {
    const steps = [];

    const n = products.length;
    const B = currentBudget;

    if (B > 100000) {
        throw new Error("Please enter a budget up to ₹100,000.");
    }

    // Create DP table
    const dp = Array.from(
        { length: n + 1 },
        () => Array(B + 1).fill(0)
    );

    steps.push(step(
        "Step 1: Create the DP table",
        calculation(
            "Table dimensions",
            "(n + 1) × (B + 1)",
            `(${n} + 1) × (${B} + 1) = ${n + 1} × ${B + 1}`
        ) +
        "<p>Rows represent products. Columns represent budget values. Initially, all cells are zero.</p>"
    ));

    // Fill table
    for (let i = 1; i <= n; i++) {
        const p = products[i - 1];

        for (let b = 0; b <= B; b++) {
            const exclude = dp[i - 1][b];

            let include = -Infinity;

            if (p.price <= b) {
                include = p.value + dp[i - 1][b - p.price];
            }

            dp[i][b] = Math.max(exclude, include);
        }
    }

    steps.push(step(
        "Step 2: Apply the recurrence formula",
        calculation(
            "DP formula",
            "DP[i][b] = max(Exclude, Include)",
            "Exclude = DP[i-1][b]<br>Include = Value + DP[i-1][b-Price]"
        ) +
        "<p>If the product price is greater than the current budget, it cannot be included.</p>"
    ));

    // Show real calculations at full budget for each row
    let calculations = "";

    for (let i = 1; i <= n; i++) {
        const p = products[i - 1];
        const exclude = dp[i - 1][B];

        if (p.price <= B) {
            const include = p.value + dp[i - 1][B - p.price];

            calculations += calculation(
                `Product: ${p.name}`,
                `Exclude = ${exclude}<br>
                 Include = ${p.value} + DP[${i - 1}][${B - p.price}]<br>
                 = ${p.value} + ${dp[i - 1][B - p.price]}<br>
                 = ${include}`,
                `DP[${i}][${B}] = max(${exclude}, ${include}) = ${dp[i][B]}`
            );
        } else {
            calculations += calculation(
                `Product: ${p.name}`,
                `Price ${money(p.price)} > Budget ${money(B)}`,
                `Cannot include this product at this budget.`
            );
        }
    }

    steps.push(step(
        "Step 3: Calculate include and exclude choices",
        `<p>Here are the actual include/exclude calculations at the entered budget:</p>
         ${calculations}`
    ));

    // Select useful columns for a readable display.
    // The algorithm still calculates every integer budget.
    const columns = new Set([0, B]);

    for (const p of products) {
        if (p.price <= B) columns.add(p.price);
    }

    let cumulative = 0;
    for (const p of products) {
        cumulative += p.price;
        if (cumulative <= B) columns.add(cumulative);
    }

    const displayColumns = [...columns].sort((a, b) => a - b);

    const tableHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Products</th>
                        ${displayColumns.map(b => `<th>${b}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${Array.from({ length: n + 1 }, (_, i) => `
                        <tr>
                            <td>${i === 0 ? "None" : products[i - 1].name}</td>
                            ${displayColumns.map(b => `<td>${dp[i][b]}</td>`).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
        <p style="margin-top:10px;color:#aaaec4">
            Selected budget columns are shown for readability. The algorithm computes every integer budget from 0 to ${B}.
        </p>
    `;

    steps.push(step(
        "Step 4: DP table values",
        `<p>Each cell stores the maximum value possible using the products considered and that budget.</p>
         ${tableHTML}`
    ));

    // Backtracking
    let selected = [];
    let b = B;

    for (let i = n; i > 0; i--) {
        if (dp[i][b] !== dp[i - 1][b]) {
            selected.push(products[i - 1]);
            b -= products[i - 1].price;
        }
    }

    selected.reverse();

    steps.push(step(
        "Step 5: Backtracking",
        `<p>Start at DP[${n}][${B}] = ${dp[n][B]}.</p>
         <p>Compare each row with the previous row. If the value changes, that product was included.</p>
         <p>Selected products: ${names(selected)}</p>
         <p>Final maximum value = ${dp[n][B]}</p>`
    ));

    steps.push(step(
        "Step 6: Verify final answer",
        calculation(
            "Total price",
            selected.map(p => p.price).join(" + "),
            `${money(sumPrice(selected))} ≤ ${money(B)}`
        ) +
        calculation(
            "Maximum value",
            selected.map(p => p.value).join(" + "),
            `= ${sumValue(selected)}`
        )
    ));

    return makeResult("Dynamic Programming", selected, steps);
}

// ================================================
// 4. GREEDY ALGORITHM
// ================================================

function greedyAlgorithm() {
    const steps = [];

    const sorted = products.map(p => ({
        ...p,
        ratio: p.value / p.price
    }));

    steps.push(step(
        "Step 1: Calculate value-to-price ratio",
        calculation(
            "Formula",
            "Ratio = Value ÷ Price",
            "Calculate for every product."
        ) +
        `<div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Calculation</th>
                        <th>Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    ${sorted.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.value} ÷ ${p.price}</td>
                            <td>${p.ratio.toFixed(4)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>`
    ));

    // Sort in descending ratio order
    sorted.sort((a, b) => b.ratio - a.ratio);

    steps.push(step(
        "Step 2: Sort in descending order",
        `<p>Products with the highest value-to-price ratio are considered first.</p>
         ${sorted.map((p, i) =>
            `<p>${i + 1}. ${p.name} = ${p.ratio.toFixed(4)}</p>`
         ).join("")}`
    ));

    // Select products
    let selected = [];
    let remaining = currentBudget;
    let selectionCalculations = "";

    for (const p of sorted) {
        if (p.price <= remaining) {
            selectionCalculations += calculation(
                `Select ${p.name}`,
                `${money(remaining)} - ${money(p.price)}`,
                `Remaining budget = ${money(remaining - p.price)}`
            );

            selected.push(p);
            remaining -= p.price;
        } else {
            selectionCalculations += calculation(
                `Skip ${p.name}`,
                `${money(p.price)} > ${money(remaining)}`,
                "Product does not fit in the remaining budget."
            );
        }
    }

    steps.push(step(
        "Step 3: Select products",
        `<p>Check each product in ratio order. Select it only if its price fits within the remaining budget.</p>
         ${selectionCalculations}`
    ));

    steps.push(step(
        "Step 4: Calculate final result",
        calculation(
            "Selected products",
            names(selected),
            `Total value = ${sumValue(selected)}`
        ) +
        calculation(
            "Total price",
            selected.map(p => p.price).join(" + "),
            `${money(sumPrice(selected))} ≤ ${money(currentBudget)}`
        ) +
        "<p>Greedy is fast, but it does not always guarantee the optimal solution for 0/1 Knapsack.</p>"
    ));

    return makeResult("Greedy", selected, steps);
}

// ================================================
// DISPLAY RESULT CARDS
// ================================================

function displayResultCards() {
    document.getElementById("results").classList.remove("hidden");

    document.getElementById("resultCards").innerHTML =
        Object.entries(algorithmResults).map(([key, r]) => `
            <div class="result-card">
                <h3>${r.algorithm}</h3>
                <p><strong>Products:</strong> ${names(r.selected)}</p>
                <p><strong>Total Cost:</strong> ${money(r.totalCost)}</p>
                <p><strong>Total Value:</strong> ${r.totalValue}</p>
                <p><strong>Remaining:</strong> ${money(r.remaining)}</p>
                <button onclick="showAlgorithm('${key}')">
                    View Mathematical Working
                </button>
            </div>
        `).join("");
}

// ================================================
// COMPARISON TABLE
// ================================================

function displayComparison() {
    const info = [
        ["Brute Force", "O(n × 2ⁿ)", "O(n)", "Yes", "brute"],
        ["Meet-in-the-Middle", "O(n × 2ⁿ⁄²)", "O(2ⁿ⁄²)", "Yes", "divide"],
        ["Dynamic Programming", "O(nB)", "O(nB)", "Yes", "dp"],
        ["Greedy", "O(n log n)", "O(n)", "Not always", "greedy"]
    ];

    document.getElementById("comparisonBody").innerHTML =
        info.map(row => `
            <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${algorithmResults[row[4]].totalValue}</td>
            </tr>
        `).join("");
}

// ================================================
// RUN ALL ALGORITHMS
// ================================================

function runAllAlgorithms() {
    const input = document.getElementById("budget");
    const budget = Number(input.value);

    if (
        input.value.trim() === "" ||
        !Number.isSafeInteger(budget) ||
        budget < 0 ||
        budget > 100000
    ) {
        alert("Enter a whole-number budget between ₹0 and ₹100,000.");
        return;
    }

    currentBudget = budget;

    try {
        algorithmResults = {
            brute: bruteForce(),
            divide: divideAndConquer(),
            dp: dynamicProgramming(),
            greedy: greedyAlgorithm()
        };

        displayResultCards();
        displayComparison();
        showAlgorithm("brute");

        document.getElementById("results").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        alert(error.message);
    }
}

// ================================================
// SHOW SELECTED ALGORITHM WORKING
// ================================================

function showAlgorithm(type) {
    const titles = {
        brute: "Brute Force Algorithm",
        divide: "Divide and Conquer – Meet-in-the-Middle",
        dp: "Dynamic Programming",
        greedy: "Greedy Algorithm"
    };

    const definitions = {
        brute: "Checks every possible combination and selects the feasible combination with maximum value.",
        divide: "Divides products into two groups, generates subsets, and uses sorting and binary search to combine suitable subsets.",
        dp: "Stores maximum values in a table and compares including and excluding each product.",
        greedy: "Selects products based on their value-to-price ratio, considering affordable products first."
    };

    const complexity = {
        brute: ["O(n × 2ⁿ)", "O(n)", "Yes"],
        divide: ["O(n × 2ⁿ⁄²)", "O(2ⁿ⁄²)", "Yes"],
        dp: ["O(nB)", "O(nB)", "Yes"],
        greedy: ["O(n log n)", "O(n)", "Not always"]
    };

    document.getElementById("algorithmTitle").textContent = titles[type];
    document.getElementById("algorithmDefinition").textContent = definitions[type];

    document.getElementById("timeComplexity").textContent = complexity[type][0];
    document.getElementById("spaceComplexity").textContent = complexity[type][1];
    document.getElementById("optimality").textContent = complexity[type][2];

    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));

    const index = {
        brute: 0,
        divide: 1,
        dp: 2,
        greedy: 3
    }[type];

    document.querySelectorAll(".tab")[index].classList.add("active");

    const working = document.getElementById("workingSteps");
    const output = document.getElementById("algorithmOutput");

    if (!algorithmResults[type]) {
        working.innerHTML = step(
            "Mathematical working",
            "Enter a budget and click Run All Algorithms to see the calculations."
        );

        output.textContent = "No result yet.";
        return;
    }

    const result = algorithmResults[type];

    working.innerHTML = result.steps.join("");

    output.innerHTML = `
        <h3>Final Mathematical Answer</h3>
        <p><strong>Algorithm:</strong> ${result.algorithm}</p>
        <p><strong>Selected Products:</strong> ${names(result.selected)}</p>
        <p><strong>Total Price:</strong> ${money(result.totalCost)}</p>
        <p><strong>Budget:</strong> ${money(currentBudget)}</p>
        <p><strong>Remaining Budget:</strong> ${money(result.remaining)}</p>
        <p><strong>Total Value:</strong> ${result.totalValue}</p>
        <p><strong>Budget Verification:</strong>
        ${money(result.totalCost)} ≤ ${money(currentBudget)}</p>
    `;
}

// ================================================
// INITIAL LOAD
// ================================================

displayProducts();
showAlgorithm("brute");
