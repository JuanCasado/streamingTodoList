
function main() {
    const inputs = getDOMInputs()

    addEventListener(inputs.addTodoButton, clickEvent, () => {
        const text = getText(inputs.addTodoText)
        clearText(inputs.addTodoText)
        createNewItem(text)
        updateList(toDo, inputs.todoList)
    })

    
}
