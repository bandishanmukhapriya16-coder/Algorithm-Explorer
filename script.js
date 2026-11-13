
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. HTML ELEMENTS
    // =====================================

    const budgetInput = document.getElementById("budget");

    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const valueInput = document.getElementById("productValue");

    const addButton = document.getElementById("addProduct");
    const sampleButton = document.getElementById("loadSample");
    const runButton = document.getElementById("runAlgorithms");

    const message = document.getElementById("message");
    const productList = document.getElementById("productList");

    const themeToggle = document.getElementById("themeToggle");

    let products = [];
    let results = {};


    // =====================================
    // 2. THEME TOGGLE
    // =====================================

    const savedTheme = localStorage.getItem("websiteTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function updateThemeButton() {

        themeToggle.textContent =
            document.body.classList.contains("light-theme")
                ? "🌙 Dark Mode"
                : "☀️ Light Mode";

    }

    updateThemeButton();

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("light-theme");

        const theme =
            document.body.classList.contains("light-theme")
                ? "light"
                : "dark";

        localStorage.setItem("websiteTheme", theme);

        updateThemeButton();

    });


    // =====================================
    // 3. DISPLAY MESSAGES
    // =====================================

    function showMessage(text, type = "") {

        message.textContent = text;
        message.className = type;

    }


    // =====================================
    // 4. CLEAR OLD RESULTS
    // =====================================

    function clearResults() {

        results = {};

        document.getElementById("resultTitle").textContent =
            "Brute Force Algorithm";

        document.getElementById("resultDescription").textContent =
            "Run the algorithms to see their results.";

        document.getElementById("timeComplexity").textContent =
            "O(2ⁿ)";

        document.getElementById("spaceComplexity").textContent =
            "O(n)";

        document.getElementById("algorithmSteps").innerHTML =
            "<li>Enter your budget and products.</li>" +
            "<li>Click Run All Algorithms.</li>" +
            "<li>Select an algorithm to view its explanation.</li>";

        document.getElementById("selectedProducts").textContent =
            "Results will appear here.";

        document.getElementById("totalPrice").textContent = "₹0";
        document.getElementById("totalValue").textContent = "0";
        document.getElementById("remainingBudget").textContent = "₹0";

        document.getElementById("resultMessage").textContent =
            "Add products and run the algorithms to compare results.";

        document.querySelectorAll(".algorithm-tab").forEach(function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.algorithm === "brute"
            );

        });

    }


    // =====================================
    // 5. DISPLAY PRODUCT LIST
    // =====================================

    function displayProducts() {

        productList.innerHTML = "";

        if (products.length === 0) {

            productList.innerHTML =
                '<p class="empty-message">No products added yet.</p>';

            return;
        }

        products.forEach(function (product, index) {

            const row = document.createElement("div");

            row.className = "product-row";

            const info = document.createElement("div");

            info.className = "product-info";

            const name = document.createElement("strong");

            name.textContent = product.name;

            const details = document.createElement("span");

            details.textContent =
                "Price: ₹" + product.price +
                " | Value: " + product.value;

            info.appendChild(name);
            info.appendChild(details);


            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {

                products.splice(index, 1);

                displayProducts();

                clearResults();

                showMessage(
                    "Product deleted successfully.",
                    "success-message"
                );

            });

            row.appendChild(info);
            row.appendChild(deleteButton);

            productList.appendChild(row);

        });

    }


    // =====================================
    // 6. ADD PRODUCT WITH VALIDATION
    // =====================================

    addButton.addEventListener("click", function () {

        const name = nameInput.value.trim();

        const price = Number(priceInput.value);

        const value = Number(valueInput.value);


        // Validate product name

        if (name === "") {

            showMessage(
                "Please enter a product name.",
                "error-message"
            );

            nameInput.focus();

            return;
        }


        if (name.length > 40) {

            showMessage(
                "Product name must be 40 characters or less.",
                "error-message"
            );

            nameInput.focus();

            return;
        }


        // Validate price

        if (
            priceInput.value.trim() === "" ||
            !Number.isSafeInteger(price) ||
            price <= 0
        ) {

            showMessage(
                "Enter a valid positive whole-number price.",
                "error-message"
            );

            priceInput.focus();

            return;
        }


        // Validate value score

        if (
            valueInput.value.trim() === "" ||
            !Number.isSafeInteger(value) ||
            value <= 0
        ) {

            showMessage(
                "Enter a valid positive whole-number value score.",
                "error-message"
            );

            valueInput.focus();

            return;
        }


        // Product limit

        if (products.length >= 20) {

            showMessage(
                "Maximum 20 products are allowed.",
                "error-message"
            );

            return;
        }


        // Duplicate name validation

        const duplicate = products.some(function (product) {

            return product.name.toLowerCase() === name.toLowerCase();

        });

        if (duplicate) {

            showMessage(
                "A product with this name already exists.",
                "error-message"
            );

            return;
        }


        // Add product

        products.push({

            name: name,
            price: price,
            value: value

        });


        displayProducts();

        clearResults();

        showMessage(
            "Product added successfully!",
            "success-message"
        );


        // Clear form fields

        nameInput.value = "";
        priceInput.value = "";
        valueInput.value = "";

    });


    // =====================================
    // 7. LOAD SAMPLE DATA
    // =====================================

    sampleButton.addEventListener("click", function () {

        budgetInput.value = 5000;

        products = [

            {
                name: "Laptop Bag",
                price: 1500,
                value: 80
            },

            {
                name: "Headphones",
                price: 2000,
                value: 90
            },

            {
                name: "Shoes",
                price: 2500,
                value: 100
            },

            {
                name: "Watch",
                price: 1000,
                value: 50
            },

            {
                name: "Keyboard",
                price: 1200,
                value: 70
            }

        ];


        displayProducts();

        clearResults();

        showMessage(
            "Sample products loaded successfully!",
            "success-message"
        );

    });


    // =====================================
    // 8. VALIDATE BUDGET AND PRODUCTS
    // =====================================

    function getInputData() {

        const budget = Number(budgetInput.value);


        if (
            budgetInput.value.trim() === "" ||
            !Number.isSafeInteger(budget) ||
            budget <= 0 ||
            budget > 100000
        ) {

            showMessage(
                "Enter a whole-number budget between ₹1 and ₹100,000.",
                "error-message"
            );

            budgetInput.focus();

            return null;
        }


        if (products.length === 0) {

            showMessage(
                "Please add at least one product before running algorithms.",
                "error-message"
            );

            return null;
        }


        return {

            budget: budget,

            products: products.map(function (product) {

                return { ...product };

            })

        };

    }


    // =====================================
    // 9. BRUTE FORCE ALGORITHM
    // =====================================

    function bruteForce(items, budget) {

        let bestValue = 0;
        let bestPrice = 0;
        let bestItems = [];


        function search(index, currentPrice, currentValue, selected) {

            // Reject combinations exceeding budget

            if (currentPrice > budget) {
                return;
            }


            // Update best solution

            if (currentValue > bestValue) {

                bestValue = currentValue;

                bestPrice = currentPrice;

                bestItems = selected.slice();

            }


            // Stop when all products are considered

            if (index === items.length) {
                return;
            }


            // Choice 1: Include current product

            selected.push(items[index]);

            search(
                index + 1,
                currentPrice + items[index].price,
                currentValue + items[index].value,
                selected
            );

            selected.pop();


            // Choice 2: Exclude current product

            search(
                index + 1,
                currentPrice,
                currentValue,
                selected
            );

        }


        search(0, 0, 0, []);


        return {

            value: bestValue,
            price: bestPrice,
            items: bestItems,

            time: "O(2ⁿ)",
            space: "O(n)",

            description:
                "Brute Force checks every possible product combination and chooses the valid combination with the highest total value.",

            steps: [

                "Start with an empty shopping selection.",

                "Consider the first product.",

                "Explore two choices: include the product or exclude it.",

                "Repeat these choices for every remaining product.",

                "Reject combinations that exceed the shopping budget.",

                "Compare valid combinations and keep the one with the highest value."

            ]

        };

    }


    // =====================================
    // 10. DIVIDE AND CONQUER
    // MEET-IN-THE-MIDDLE
    // =====================================

    function divideAndConquer(items, budget) {

        // Divide products into two groups

        const middle = Math.floor(items.length / 2);

        const left = items.slice(0, middle);

        const right = items.slice(middle);


        // Generate all affordable subsets of a group

        function generateSubsets(group) {

            const subsets = [];


            function generate(index, price, value, selected) {

                if (price <= budget) {

                    subsets.push({

                        price: price,
                        value: value,
                        items: selected.slice()

                    });

                }


                if (index === group.length) {
                    return;
                }


                // Include product

                selected.push(group[index]);

                generate(
                    index + 1,
                    price + group[index].price,
                    value + group[index].value,
                    selected
                );

                selected.pop();


                // Exclude product

                generate(
                    index + 1,
                    price,
                    value,
                    selected
                );

            }


            generate(0, 0, 0, []);

            return subsets;

        }


        const leftSubsets = generateSubsets(left);

        const rightSubsets = generateSubsets(right);


        // Sort right subsets by price

        rightSubsets.sort(function (a, b) {

            return a.price - b.price;

        });


        // Store best value seen up to each position

        const prefixBest = [];

        let bestSoFar = null;


        for (let i = 0; i < rightSubsets.length; i++) {

            const current = rightSubsets[i];

            if (
                bestSoFar === null ||
                current.value > bestSoFar.value
            ) {

                bestSoFar = current;

            }

            prefixBest.push(bestSoFar);

        }


        let bestValue = 0;

        let bestPrice = 0;

        let bestItems = [];


        // Combine left and right subsets

        for (const leftSet of leftSubsets) {

            const remaining = budget - leftSet.price;


            // Binary search

            let low = 0;

            let high = rightSubsets.length - 1;

            let answer = -1;


            while (low <= high) {

                const mid = Math.floor((low + high) / 2);


                if (rightSubsets[mid].price <= remaining) {

                    answer = mid;

                    low = mid + 1;

                } else {

                    high = mid - 1;

                }

            }


            if (answer !== -1) {

                const rightSet = prefixBest[answer];

                const totalValue =
                    leftSet.value + rightSet.value;

                const totalPrice =
                    leftSet.price + rightSet.price;


                if (totalValue > bestValue) {

                    bestValue = totalValue;

                    bestPrice = totalPrice;

                    bestItems = leftSet.items.concat(rightSet.items);

                }

            }

        }


        return {

            value: bestValue,
            price: bestPrice,
            items: bestItems,

            time: "O(n × 2ⁿ/²)",
            space: "O(2ⁿ/²)",

            description:
                "Meet-in-the-Middle divides products into two groups, generates their subsets separately and combines the best affordable combinations.",

            steps: [

                "Divide the product list into two halves.",

                "Generate all possible subsets in the first half.",

                "Generate all possible subsets in the second half.",

                "Sort the second-half subsets by their total price.",

                "Calculate the remaining budget for each first-half subset.",

                "Use binary search to find the best affordable second-half subset.",

                "Combine both halves and keep the combination with the highest total value."

            ]

        };

    }


    // =====================================
    // 11. DYNAMIC PROGRAMMING
    // =====================================

    function dynamicProgramming(items, budget) {

        const n = items.length;


        // Create DP table

        const dp = Array.from(

            { length: n + 1 },

            function () {

                return new Array(budget + 1).fill(0);

            }

        );


        // Fill DP table

        for (let i = 1; i <= n; i++) {

            const price = items[i - 1].price;

            const value = items[i - 1].value;


            for (let w = 0; w <= budget; w++) {

                // Exclude current product

                dp[i][w] = dp[i - 1][w];


                // Include current product if it fits

                if (price <= w) {

                    dp[i][w] = Math.max(

                        dp[i][w],

                        value + dp[i - 1][w - price]

                    );

                }

            }

        }


        // Find selected products

        let remainingBudget = budget;

        const selectedItems = [];


        for (let i = n; i > 0; i--) {

            if (
                dp[i][remainingBudget] !==
                dp[i - 1][remainingBudget]
            ) {

                selectedItems.push(items[i - 1]);

                remainingBudget -= items[i - 1].price;

            }

        }


        selectedItems.reverse();


        const totalPrice = selectedItems.reduce(

            function (sum, item) {

                return sum + item.price;

            },

            0

        );


        return {

            value: dp[n][budget],

            price: totalPrice,

            items: selectedItems,

            time: "O(nB)",

            space: "O(nB)",

            description:
                "Dynamic Programming stores results of smaller subproblems in a table to calculate the optimal shopping combination.",

            steps: [

                "Create a DP table with products as rows and budget amounts as columns.",

                "Initialize the table with zero values.",

                "Consider each product one by one.",

                "For each budget, compare excluding the product with including it.",

                "Store the maximum value in the table.",

                "Trace backwards through the table to identify selected products.",

                "Return the combination with the maximum total value."

            ]

        };

    }


    // =====================================
    // 12. GREEDY ALGORITHM
    // =====================================

    function greedyAlgorithm(items, budget) {

        // Sort by value-to-price ratio

        const sortedItems = items.slice().sort(function (a, b) {

            const ratioA = a.value / a.price;

            const ratioB = b.value / b.price;

            return ratioB - ratioA;

        });


        let remaining = budget;

        let totalValue = 0;

        let totalPrice = 0;

        const selectedItems = [];


        // Select products based on ratio

        for (const item of sortedItems) {

            if (item.price <= remaining) {

                selectedItems.push(item);

                remaining -= item.price;

                totalPrice += item.price;

                totalValue += item.value;

            }

        }


        return {

            value: totalValue,

            price: totalPrice,

            items: selectedItems,

            time: "O(n log n)",

            space: "O(n)",

            description:
                "Greedy selects products with the highest value-to-price ratio first. It makes locally best choices but is not guaranteed to find the globally optimal solution.",

            steps: [

                "Calculate the value-to-price ratio for every product.",

                "Sort products in descending order of this ratio.",

                "Start with the full shopping budget.",

                "Select the next product if it fits the remaining budget.",

                "Skip products that do not fit.",

                "Continue until all products have been considered.",

                "Display the selected products and total value."

            ]

        };

    }


    // =====================================
    // 13. DISPLAY ALGORITHM RESULTS
    // =====================================

    function displayResult(algorithm) {

        const result = results[algorithm];

        if (!result) {
            return;
        }


        const names = {

            brute: "Brute Force Algorithm",

            divide: "Divide and Conquer – Meet-in-the-Middle",

            dp: "Dynamic Programming Algorithm",

            greedy: "Greedy Algorithm"

        };


        // Display algorithm name

        document.getElementById("resultTitle").textContent =
            names[algorithm];


        document.getElementById("resultDescription").textContent =
            result.description;


        // Display complexities

        document.getElementById("timeComplexity").textContent =
            result.time;


        document.getElementById("spaceComplexity").textContent =
            result.space;


        // Display explanation steps

        const stepsList =
            document.getElementById("algorithmSteps");

        stepsList.innerHTML = "";


        result.steps.forEach(function (step) {

            const li = document.createElement("li");

            li.textContent = step;

            stepsList.appendChild(li);

        });


        // Display selected products

        const selectedProducts =
            document.getElementById("selectedProducts");

        selectedProducts.innerHTML = "";


        if (result.items.length === 0) {

            selectedProducts.textContent =
                "No products can be selected within this budget.";

        } else {

            result.items.forEach(function (item) {

                const row = document.createElement("div");

                row.className = "selected-product";


                const name = document.createElement("span");

                name.textContent = item.name;


                const price = document.createElement("span");

                price.textContent = "₹" + item.price;


                row.appendChild(name);

                row.appendChild(price);

                selectedProducts.appendChild(row);

            });

        }


        // Display summary

        const budget = Number(budgetInput.value);


        document.getElementById("totalPrice").textContent =
            "₹" + result.price;


        document.getElementById("totalValue").textContent =
            result.value;


        document.getElementById("remainingBudget").textContent =
            "₹" + (budget - result.price);


        // Compare greedy result with optimal DP result

        const optimalValue = results.dp.value;

        if (
            algorithm === "greedy" &&
            result.value < optimalValue
        ) {

            document.getElementById("resultMessage").textContent =
                "Greedy found a valid solution, but it is not optimal for this input. Dynamic Programming found a higher value.";

        } else {

            document.getElementById("resultMessage").textContent =
                "Total value: " + result.value +
                ". All selected products are within your budget.";

        }

    }


    // =====================================
    // 14. RUN ALL FOUR ALGORITHMS
    // =====================================

    runButton.addEventListener("click", function () {

        const data = getInputData();


        if (data === null) {
            return;
        }


        const budget = data.budget;

        const items = data.products;


        // Execute all four algorithms

        results.brute =
            bruteForce(items, budget);


        results.divide =
            divideAndConquer(items, budget);


        results.dp =
            dynamicProgramming(items, budget);


        results.greedy =
            greedyAlgorithm(items, budget);


        showMessage(
            "All four algorithms completed successfully!",
            "success-message"
        );


        // Display first algorithm

        displayResult("brute");


        // Scroll to algorithm results

        document.getElementById("algorithms").scrollIntoView({

            behavior: "smooth"

        });

    });


    // =====================================
    // 15. SWITCH BETWEEN ALGORITHM TABS
    // =====================================

    document.querySelectorAll(".algorithm-tab").forEach(

        function (tab) {

            tab.addEventListener("click", function () {


                if (Object.keys(results).length === 0) {

                    showMessage(
                        "Please add products and click Run All Algorithms first.",
                        "error-message"
                    );

                    return;

                }


                // Remove active class from all tabs

                document.querySelectorAll(".algorithm-tab").forEach(

                    function (button) {

                        button.classList.remove("active");

                    }

                );


                // Activate selected tab

                tab.classList.add("active");


                // Display selected algorithm

                const algorithm = tab.dataset.algorithm;

                displayResult(algorithm);

            });

        }

    );


    // =====================================
    // 16. RESET RESULTS WHEN INPUT CHANGES
    // =====================================

    budgetInput.addEventListener("input", function () {

        clearResults();

    });


    // =====================================
    // 17. INITIALIZE WEBSITE
    // =====================================

    displayProducts();

    clearResults();

    console.log("Algorithm Explorer is ready!");

});
