let visible = false;
let users = [];

function set_var(name, value) {
    document.documentElement.style.setProperty(`--${name}`, `${value}px`);
}

function scroll_to_bottom() {
    const messages = document.getElementById("messages");
    const rect = messages.getBoundingClientRect();
    messages.scrollTop = messages.scrollHeight - rect.height + 1;
}

function show(focus = true) {
    const chat_input = document.getElementById("chat_input");
    set_var("chat-height", 240);
    chat_input.value = "";
    scroll_to_bottom();
    if (focus) chat_input.focus();
}

function hide() {
    document.getElementById("chat_input").blur();
    set_var("chat-height", 0);
}

function toggle(focus) {
    visible = !visible;
    if (visible) {
        show(focus);
    } else {
        hide();
    }
}

function action(nick, text) {
    const messages = document.getElementById("messages");
    const rect = messages.getBoundingClientRect();
    const scroll = (rect.height > messages.scrollHeight) || (messages.scrollTop == messages.scrollHeight - rect.height + 1);
    const nick_div = document.createElement("div");
    nick_div.classList.add("nick");
    nick_div.innerText = `${nick} ${text}`;
    const container = document.createElement("div");
    container.appendChild(nick_div);
    document.getElementById("messages").appendChild(container);
    if (scroll) scroll_to_bottom();
}

function join(id, nick, group, show_join = true) {
    if (show_join) action(nick, "has joined");
    users[id] = {nick, group, div: document.createElement("div")};
    if (group == "") {
        users[id].div.innerText = nick;
    } else {
        users[id].div.innerText = `${nick} <${group}>`;
    }
    document.getElementById("user_list").appendChild(users[id].div);
}

function leave(id) {
    if (users[id]) {
        action(users[id].nick, "has left");
        document.getElementById("user_list").removeChild(users[id].div);
        delete users[id];
    }
}

function chat(id, nick, group, text) {
    const messages = document.getElementById("messages");
    const rect = messages.getBoundingClientRect();
    const scroll = (rect.height > messages.scrollHeight) || (messages.scrollTop == messages.scrollHeight - rect.height + 1);
    const nick_div = document.createElement("div");
    nick_div.classList.add("nick");
    if (group == "") {
        nick_div.innerText = `${nick}:`;
    } else {
        nick_div.innerText = `${nick} <${group}>:`;
    }
    const text_div = document.createElement("div");
    text_div.classList.add("text");
    text_div.innerText = text;
    const container = document.createElement("div");
    container.appendChild(nick_div);
    container.appendChild(text_div);
    messages.appendChild(container);
    if (users[id] && (users[id].nick != nick || users[id].group != group)) {
        users[id].nick = nick;
        users[id].group = group;
        if (group == "") {
            users[id].div.innerText = nick;
        } else {
            users[id].div.innerText = `${nick} <${group}>`;
        }
    }
    if (scroll) scroll_to_bottom();
}

module.exports = {toggle, join, leave, chat};
