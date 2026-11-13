
# 🛍️ Algorithm Explorer – Smart Shopping Budget Optimizer

## 📌 Project Overview

Algorithm Explorer is a web-based application that helps users select products within a given shopping budget while maximizing their total value.

The application solves the **0/1 Knapsack Problem** using four different algorithmic approaches:

1. Brute Force
2. Divide and Conquer (Meet-in-the-Middle)
3. Dynamic Programming
4. Greedy Algorithm

Users can enter their budget and product details, run all four algorithms, and compare their results.

## 🎯 Problem Statement

A customer has a fixed shopping budget and a list of products. Each product has:
- A price.
- A value or priority score.

The objective is to select products that maximize the total value without exceeding the available budget.

### Mathematical Formulation

Maximize:

`Total Value = Σ (Value[i] × x[i])`

Subject to:

`Σ (Price[i] × x[i]) ≤ Budget`

Where:

- `x[i] = 1` if the product is selected.
- `x[i] = 0` if the product is not selected.

Each product can be selected only once.

## ✨ Features

- User-friendly and responsive interface.
- Dark mode and light mode.
- Custom shopping budget input.
- Add and remove products.
- Input validation and error messages.
- Sample product data.
- Four algorithmic approaches.
- Step-by-step algorithm explanations.
- Time and space complexity analysis.
- Comparison of algorithm results.
- Displays selected products, total spending, total value and remaining budget.

## 🧠 Algorithms Implemented

### 1. Brute Force

- Generates possible combinations of products.
- Checks whether each combination fits within the budget.
- Selects the combination with the maximum total value.

**Time Complexity:** `O(2^n)`

**Space Complexity:** `O(n)`

### 2. Divide and Conquer – Meet-in-the-Middle

- Divides the product list into two halves.
- Generates possible subsets for both halves.
- Combines feasible subsets to find the maximum value.

**Time Complexity:** `O(n × 2^(n/2))`

**Space Complexity:** `O(2^(n/2))`

### 3. Dynamic Programming

- Uses a DP table to store maximum values for different budgets.
- Avoids repeatedly solving the same subproblems.
- Reconstructs the selected products from the DP table.

**Time Complexity:** `O(n × B)`

**Space Complexity:** `O(n × B)`

### 4. Greedy Algorithm

- Calculates the value-to-price ratio of each product.
- Sorts products based on their ratios.
- Selects products if they fit within the remaining budget.

**Time Complexity:** `O(n log n)`

**Space Complexity:** `O(n)`

**Note:** Greedy is not guaranteed to produce the optimal solution for the 0/1 Knapsack Problem.

## 🛠️ Technologies Used

- HTML5 – Website structure.
- CSS3 – Styling and responsive design.
- JavaScript – Algorithm implementation and functionality.
- VS Code – Development environment.
- Netlify – Website deployment.
- GitHub – Source code management.

## 📂 Project Structure

```text
Algorithm-Explorer/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run the Project

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server.
4. Enter your shopping budget.
5. Add products with their prices and value scores.
6. Click **Run All Algorithms**.
7. Switch between the four algorithms to view their results.

## 🧪 Sample Input

**Budget:** ₹5,000

| Product | Price | Value |
|---|---:|---:|
| Laptop Bag | ₹1,500 | 80 |
| Headphones | ₹2,000 | 90 |
| Shoes | ₹2,500 | 100 |
| Watch | ₹1,000 | 50 |
| Keyboard | ₹1,200 | 70 |

## 📊 Expected Sample Results

| Algorithm | Total Spending | Total Value |
|---|---:|---:|
| Brute Force | ₹4,700 | 240 |
| Divide and Conquer | ₹4,700 | 240 |
| Dynamic Programming | ₹4,700 | 240 |
| Greedy | ₹3,700 | 200 |

The first three approaches find an optimal solution for this sample. Greedy produces a feasible solution but does not guarantee the maximum value.

## 📈 Project Objective

The main objective is to understand how different algorithmic approaches solve the same real-world optimization problem.

This project demonstrates the differences in:
- Algorithm design techniques.
- Execution time and space requirements.
- Optimality of solutions.
- Practical applications of Design and Analysis of Algorithms.

## 👩‍💻 Developed As

**Academic Project – Design and Analysis of Algorithms (DAA)**

**Project Title:** Algorithm Explorer – Smart Shopping Budget Optimizer

**Domain:** Algorithm Design and Optimization

**Repository:** Add your GitHub repository URL here.

**Live Demo:** Add your Netlify deployment URL here.

---

⭐ If you find this project useful, feel free to explore the source code and learn how different algorithms solve the 0/1 Knapsack Problem.
