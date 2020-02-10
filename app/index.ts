
const { botToken, emailAdress } = require('./config/config');
import { executeQuery } from './helpers/database-adapter';
import { queries } from './helpers/queries';
import { logger } from './helpers/logger';
import { QueryResult, Query } from 'pg';
import { Project } from './@types/queries';

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


const newProject = new WizardScene(
    "new_project",
    ctx => {
        ctx.reply("Please enter the project name");
        return ctx.wizard.next();
    },
    async ctx => {
        //database Call
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            await executeQuery(queries.INSERT_PROJECT, [ctx.message.text, "", userId, chatId]);
            ctx.replyWithHTML(
                `The project  <b>${
                ctx.message.text
                }</b> were added`
            );
        }
        catch (err) {
            logger.error(err);
            ctx.replyWithHTML(
                `<b>Error while saving the project in the database</b>`
            );
        }
        return ctx.scene.leave();
    }
);

bot.command('show_all_projects', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    try {
        await addChatAndUserIfNotExist(chatId, userId);
        let result:QueryResult = await executeQuery(queries.GET_PROJECTS, [userId, chatId]);
        let text:string = `You don't have any projects please create a project with the command "/new_project"`
        if(result.rowCount > 0)
        {
            let projects:Array<Project> = result.rows;
            text = "You have the following projects"
            for (const key in projects) {
                text += `\n${+key+1}. ${projects[key].name}`;
            }
            result.rows.forEach((element:Project) => {
                text += ''
            });
        }
        ctx.replyWithHTML(text);
    }
    catch (err) {
        logger.error(err);
        ctx.replyWithHTML(
            `<b>Error while saving the project in the database</b>`
        );
    }
})

bot.command('start_time', async (ctx) => 
{
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    addChatIfNotExist(chatId);
    let keyboard = await getProjectsInKeyboard(userId,chatId, 'start_time');
    ctx.reply('Select the your project', keyboard.draw());
})

bot.command('end_time', async (ctx) =>
{
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;

    try {
        let activeProjectResult:QueryResult = await executeQuery(queries.GET_ACTIVE_PROJECT, [userId, chatId]);
        let updateResult:QueryResult = await executeQuery(queries.FINISH_TIME, [userId, chatId]);
        if(updateResult.rowCount > 0 && activeProjectResult.rowCount == 1) 
            ctx.replyWithHTML(`The time tracker finished the project <b>${activeProjectResult.rows[0].name}</b>`);
        else if(activeProjectResult.rowCount > 0)
            ctx.replyWithHTML(`There are more than one project open... please write a mail to ${emailAdress}`)
        else
            ctx.replyWithHTML(`There is no open project!`)
    } catch (err) {
        console.log(err);
        logger.error(err);
        ctx.replyWithHTML(`Error while finishing time tracking`);
    }  

})


bot.command('projectInformations', (ctx) =>
{

})


const regex = new RegExp('action[0-9]-start_time');

bot.action(regex, async (ctx) => {
    let actionData = ctx.update.callback_query.data;
    try {
        await executeQuery(queries.NEW_TIME, [actionData.replace("action", "").split("-")[0], ctx.update.callback_query.from.id, ctx.update.callback_query.message.chat.id ])
        ctx.replyWithHTML(`The time tracker for the project<b> ${actionData.replace("action", "").split("-")[2]}</b> is active`, Extra.markup(Markup.removeKeyboard()));
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while starting time tracking`);
    }    
});

bot.catch((err, ctx) => {
    logger.error(`Ooops, ecountered an error for ${ctx.updateType}`, err)
})

const stage = new Stage([newProject]);
bot.use(session());
bot.use(stage.middleware());

bot.command('new_project', async ({scene }) => {
    await scene.leave()
    await scene.enter('new_project')
})


bot.launch();


async function getProjectsInKeyboard(userId: number, chatId:number, kindOfKeyboard: string) {
    let result: QueryResult = await executeQuery(queries.GET_PROJECTS, [userId, chatId]);
    if (result.rowCount > 0) {
        const options = {
            inline: true, // default
            duplicates: false, // default
            newline: false, // default
        };
        const keyboard = new Keyboard(options);
        let row = [];
        let rows = [];
        let columnCount = 0;
        for (let i = 0; i < result.rows.length; i++) {
            ++columnCount;
            let actionName: string = result.rows[i].id + "-" + kindOfKeyboard + "-" + result.rows[i].name ;
            let string = result.rows[i].name + ":action" + actionName;

            row.push(string)
            if (columnCount == 2) {
                rows.push(row);
                row = [];
                columnCount = 0;
            }

        };
        rows.push(row);
        rows.forEach(element => {
            keyboard
                .add(element)

        });
        return keyboard;
    }
}

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
