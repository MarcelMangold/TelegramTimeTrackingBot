
const { botToken } = require('./config/config');
import { executeQuery } from './helpers/database-adapter';
import { queries } from './helpers/queries';
import { logger } from './helpers/logger';
import { QueryResult } from 'pg';
import { AccountBalanceDetails, AccountBalance } from './@types/queries';

const Telegraf = require('telegraf');
const session = Telegraf.session;
const Markup = Telegraf.Markup;
const Extra = Telegraf.Extra;
const Keyboard = require('telegraf-keyboard');
const WizardScene = require("telegraf/scenes/wizard");
const Stage = require("telegraf/stage");

const bot = new Telegraf(botToken)

bot.start((ctx) => {
  /*   let chatId = ctx.update.message.chat.id;
    let userId = ctx.update.message.from.id;

    addChatAndUserIfNotExist(chatId, userId); */

    ctx.reply(
        "Welcome to the timeTracker Bot"
    )
});



bot.catch((err, ctx) => {
    logger.error(`Ooops, ecountered an error for ${ctx.updateType}`, err)
})

bot.launch()

async function addChatAndUserIfNotExist(chatId, userId) {
    await addChatIfNotExist(chatId);
    await addUserIfNotExist(userId);
}

async function addChatIfNotExist(chatId) {
    let response = await executeQuery(queries.CHECK_IF_CHAT_EXIST, [chatId]);
    if (response['rowCount'] == 0) {
        await executeQuery(queries.ADD_CHAT, [chatId]);
    }
}

async function addUserIfNotExist(userId) {
    let response = await executeQuery(queries.CHECK_IF_USER_EXIST, [userId]);
    if (response['rowCount'] == 0) {
        executeQuery(queries.ADD_USER, [userId]);
    }
}
