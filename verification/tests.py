"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {"input": [1, 2, 3, 4, 5], "answer": 3},
        {"input": [3, 1, 2, 5, 3], "answer": 3},
        {"input": [1, 300, 2, 200, 1], "answer": 2},
        {"input": [3, 6, 20, 99, 10, 15], "answer": 12.5},
        {"input": [33, 56, 62], "answer": 56},
        {"input": [21, 56, 84, 82, 52, 9], "answer": 54},
        {"input": [100, 1, 1, 1, 1, 1, 1], "answer": 1},
        {"input": [64, 6, 92, 7, 70, 5], "answer": 35.5},
        {"input": [12, 33, 7, 75, 91, 22, 74, 5, 51, 26, 55, 32], "answer": 32.5},
        {"input": [61, 71, 48, 98, 6, 81], "answer": 66},
        {"input": [90, 88, 10, 95, 45, 8, 2, 37, 31, 12], "answer": 34},
        {"input": [4, 44, 7, 33, 40, 9, 18, 6, 43], "answer": 18},
        {"input": [34, 49, 29, 14], "answer": 31.5},
        {"input": [78, 89, 95, 82, 76, 16, 50, 86, 31, 13, 79, 94], "answer": 78.5},
        {"input": [7, 75, 35, 54, 27, 41, 9, 5], "answer": 31},
        {"input": [10, 27, 24, 81, 36, 66, 12], "answer": 27},
        {"input": [31, 99, 15, 19, 64, 100, 99, 56], "answer": 60},
        {"input": [53, 3, 55, 57, 58, 79, 83], "answer": 57}
    ],
    "Extra": [
        {"input": [92, 25, 49, 71, 18, 38, 28, 54], "answer": 43.5},
        {"input": [31, 33, 15, 81, 100, 98, 32, 87, 76], "answer": 76},
        {"input": [29, 45, 27, 64, 84, 69, 49], "answer": 49},
        {"input": [62, 88, 41, 6, 35, 21, 26, 90, 93, 23, 52, 9], "answer": 38},
        {"input": [57, 15, 16, 9, 22, 70, 59], "answer": 22},
    ]
}
