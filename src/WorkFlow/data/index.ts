import iconApi from '../images/icon-api.png';
import iconLLM from '../images/icon-LLM.png';
import iconCode from '../images/icon-code.png';
import iconKnowledge from '../images/icon-knowledge.png';
import iconWorkflow from '../images/icon-workflow.png';
import iconImageflow from '../images/icon-imageflow.png';
import iconCondition from '../images/icon-condition.png';
import iconText from '../images/icon-text.png';
import iconMessager from '../images/icon-messager.png';
import iconVariable from '../images/icon-variable.png';
import iconDatabase from '../images/icon-database.png';

export const modelItemDatas = [
    {
        type:'api',
        title:'插件',
        icon:iconApi,
        disabled:true,
        tooltip:'通过添加工具访问实时数据和执行外部操作'
    },
    {
        type:'LLM',
        title:'大模型',
        icon:iconLLM,
        disabled:false,
        tooltip:'调用大语言模型,使用变量和提示词生成回复'
    },
    {
        type:'code',
        title:'代码',
        icon:iconCode,
        disabled:true,
        tooltip:'编写代码，处理输入变量来生成返回值'
    },
    {
        type:'knowledge',
        title:'知识库',
        icon:iconKnowledge,
        disabled:false,
        tooltip:'在选定的知识中,根据输入变量召回最匹配的信息,并以列表形式返回'
    },
    {
        type:'workflow',
        title:'工作流',
        icon:iconWorkflow,
        disabled:true,
        tooltip:'集成已发布工作流，可以执行嵌套子任务'
    },
    {
        type:'imageflow',
        title:'图像流',
        icon: iconImageflow,
        disabled:true,
        tooltip:'集成已发布图像流，可以执行嵌套子任务'
    },
    {
        type:'condition',
        title:'选择器',
        icon:iconCondition,
        disabled:false,
        tooltip:'连接多个下游分支，若设定的条件成立则仅运行对应的分支，若均不成立则只运行“否则”分支'
    },
    {
        type:'text',
        title:'文本处理',
        icon: iconText,
        disabled:false,
        tooltip:'用于处理多个字符串类型变量的格式'
    },
    {
        type:'messager',
        title:'消息',
        icon: iconMessager,
        disabled:true,
        tooltip:'支持中间过程的消息输出，支持流式和非流式两种方式'
    },
    {
        type:'variable',
        title:'变量',
        icon:iconVariable,
        disabled:true,
        tooltip:'用于读取和写入机器人中的变量。变量名称必须与机器人中的变量名称相匹配。'
    },
    {
        type:'database',
        title:'数据库',
        icon:iconDatabase,
        disabled:true,
        tooltip:'可支持对 Database 放开读写控制，用户可读写其他用户提交的数据，由开发者控制。需要提前在 Bot 的 Database 中添加 Table。'
    },
];