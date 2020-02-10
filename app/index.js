"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _a = require('./config/config'), botToken = _a.botToken, emailAdress = _a.emailAdress;
var database_adapter_1 = require("./helpers/database-adapter");
var queries_1 = require("./helpers/queries");
var logger_1 = require("./helpers/logger");
var Telegraf = require('telegraf');
var session = Telegraf.session;
var Markup = Telegraf.Markup;
var Extra = Telegraf.Extra;
var Keyboard = require('telegraf-keyboard');
var WizardScene = require("telegraf/scenes/wizard");
var Stage = require("telegraf/stage");
var bot = new Telegraf(botToken);
bot.start(function (ctx) {
    /*   let chatId = ctx.update.message.chat.id;
      let userId = ctx.update.message.from.id;
  
      addChatAndUserIfNotExist(chatId, userId); */
    ctx.reply("Welcome to the timeTracker Bot");
});
var newProject = new WizardScene("new_project", function (ctx) {
    ctx.reply("Please enter the project name");
    return ctx.wizard.next();
}, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.INSERT_PROJECT, [ctx.message.text, "", userId, chatId])];
            case 3:
                _a.sent();
                ctx.replyWithHTML("The project  <b>" + ctx.message.text + "</b> were added");
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                logger_1.logger.error(err_1);
                ctx.replyWithHTML("<b>Error while saving the project in the database</b>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
bot.command('show_all_projects', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, result, text_1, projects, key, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_PROJECTS, [userId, chatId])];
            case 3:
                result = _a.sent();
                text_1 = "You don't have any projects please create a project with the command \"/new_project\"";
                if (result.rowCount > 0) {
                    projects = result.rows;
                    text_1 = "You have the following projects";
                    for (key in projects) {
                        text_1 += "\n" + (+key + 1) + ". " + projects[key].name;
                    }
                    result.rows.forEach(function (element) {
                        text_1 += '';
                    });
                }
                ctx.replyWithHTML(text_1);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                logger_1.logger.error(err_2);
                ctx.replyWithHTML("<b>Error while saving the project in the database</b>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.command('start_time', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                addChatIfNotExist(chatId);
                return [4 /*yield*/, getProjectsInKeyboard(userId, chatId, 'start_time')];
            case 1:
                keyboard = _a.sent();
                ctx.reply('Select the your project', keyboard.draw());
                return [2 /*return*/];
        }
    });
}); });
bot.command('end_time', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, activeProjectResult, updateResult, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_ACTIVE_PROJECT, [userId, chatId])];
            case 2:
                activeProjectResult = _a.sent();
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.FINISH_TIME, [userId, chatId])];
            case 3:
                updateResult = _a.sent();
                if (updateResult.rowCount > 0 && activeProjectResult.rowCount == 1)
                    ctx.replyWithHTML("The time tracker finished the project " + activeProjectResult.rows[0].name);
                else if (activeProjectResult.rowCount > 0)
                    ctx.replyWithHTML("There are more than one project open... please write a mail to " + emailAdress);
                else
                    ctx.replyWithHTML("There is no open project!");
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                logger_1.logger.error(err_3);
                ctx.replyWithHTML("Error while finishing time tracking");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.command('projectInformations', function (ctx) {
});
var regex = new RegExp('action[0-9]-start_time');
bot.action(regex, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var actionData, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                actionData = ctx.update.callback_query.data;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.NEW_TIME, [actionData.replace("action", "").split("-")[0], ctx.update.callback_query.from.id, ctx.update.callback_query.message.chat.id])];
            case 2:
                _a.sent();
                ctx.replyWithHTML("The time tracker for the project<b> " + actionData.replace("action", "").split("-")[2] + "</b> is active", Extra.markup(Markup.removeKeyboard()));
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.logger.error(err_4);
                ctx.replyWithHTML("Error while starting time tracking");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
bot["catch"](function (err, ctx) {
    logger_1.logger.error("Ooops, ecountered an error for " + ctx.updateType, err);
});
var stage = new Stage([newProject]);
bot.use(session());
bot.use(stage.middleware());
bot.command('new_project', function (_a) {
    var scene = _a.scene;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, scene.leave()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, scene.enter('new_project')];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
bot.launch();
function getProjectsInKeyboard(userId, chatId, kindOfKeyboard) {
    return __awaiter(this, void 0, void 0, function () {
        var result, options, keyboard_1, row, rows, columnCount, i, actionName, string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_PROJECTS, [userId, chatId])];
                case 1:
                    result = _a.sent();
                    if (result.rowCount > 0) {
                        options = {
                            inline: true,
                            duplicates: false,
                            newline: false
                        };
                        keyboard_1 = new Keyboard(options);
                        row = [];
                        rows = [];
                        columnCount = 0;
                        for (i = 0; i < result.rows.length; i++) {
                            ++columnCount;
                            actionName = result.rows[i].id + "-" + kindOfKeyboard + "-" + result.rows[i].name;
                            string = result.rows[i].name + ":action" + actionName;
                            row.push(string);
                            if (columnCount == 2) {
                                rows.push(row);
                                row = [];
                                columnCount = 0;
                            }
                        }
                        ;
                        rows.push(row);
                        rows.forEach(function (element) {
                            keyboard_1
                                .add(element);
                        });
                        return [2 /*return*/, keyboard_1];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function addChatAndUserIfNotExist(chatId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addChatIfNotExist(chatId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, addUserIfNotExist(userId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addChatIfNotExist(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.CHECK_IF_CHAT_EXIST, [chatId])];
                case 1:
                    response = _a.sent();
                    if (!(response['rowCount'] == 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.ADD_CHAT, [chatId])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addUserIfNotExist(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.CHECK_IF_USER_EXIST, [userId])];
                case 1:
                    response = _a.sent();
                    if (response['rowCount'] == 0) {
                        database_adapter_1.executeQuery(queries_1.queries.ADD_USER, [userId]);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
