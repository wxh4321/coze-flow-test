export const startNodeParams = [
    {
        id:1,
        list:[
            {type:'input',value:'BOT_USER_INPUT',placeholder:'',warning:'',disabled:true},
            {
                type:'select',
                value:'String',
                options:[
                    {label:'String',value:'String'},
                    {label:'Integer',value:'Integer'}
                ],
                placeholder:'',
                noDataText:'暂无数据',
                warning:'',
                disabled:true
            },
            {
                type:'textarea',value:'用户本轮对话输入内容',placeholder:'',warning:'',disabled:true,
                maxlength:1000,    
                showWordLimit:true,
            },
            {type:'checkbox',value:'',selected:true,placeholder:'',warning:'',disabled:true},
            {type:'delete-icon',disabled:true}
        ],
    }
];

export const endNodeParams = [];
export const bigModelInputNodeParams = [];
export const bigModelOutputNodeParams = [
    {
        id:1,
        list:[
            {
                type:'input',
                value:'output',
                placeholder:'输入变量名',
                warning:'',
                disabled: false,
                style:{},
            },
            {
                type:'select',
                value:'String',
                options:[
                    {label:'String',value:'String'},
                    {label:'Integer',value:'Integer'}
                ],
                placeholder:'',
                noDataText:'暂无数据',
                warning:'',
                disabled:false,
                style:{},
            },
            {
                type:'input',
                value:'',
                placeholder:'请描述变量的用途',
                warning:'',
                disabled: false,
                style:{},
            },
            {
                type:'delete-icon',
                disabled:false,
                actionDisabled:true,
                style:{
                    marginTop:'6px',
                    fontSize:'20px',
                    cursor:'not-allowed'
                },
            }
        ]
    }
];

export const knowledgeNodeParams = [
    {
        id:1,
        list:[
            {
                type:'input-text',
                name:'Query',
                value:'String',
                required:true,
                // placeholder:'',
                // warning:'',
                // disabled: false,
                // style:{},
            },
            {
                type:'select',
                placeholder:'',
                noDataText:'暂无数据',
                warning:'',
                disabled:false,
                value:'1',
                options:[
                    {label:'引用',value:'1'},
                    {label:'输入',value:'2'}
                ],
                style:{
                    width:'calc(100% + 4px)',
                },
                cutBorderRight:true,
            },
            {
                type:'select',
                noDataText:'暂无数据',
                warning:'',
                disabled:false,
                value:'',
                placeholder:'请选择',
                options:[],
                style:{
                    marginLeft:'-4px',
                    width:'calc(100% + 4px)',
                },
                cutBorderLeft:true,
            }
        ]
    }
];

export const textNodeParams = [
    {
        id:1,
        list:[
            {
                type:'input-text',
                name:'String1',
                value:'',
                required:false,
                style:{
                    height:'32px'
                }
                // placeholder:'',
                // warning:'',
                // disabled: false,
            },
            {
                type:'select',
                placeholder:'',
                noDataText:'暂无数据',
                warning:'',
                disabled:false,
                value:'1',
                options:[
                    {label:'引用',value:'1'},
                    {label:'输入',value:'2'}
                ],
                style:{
                    width:'calc(100% + 4px)',
                },
                cutBorderRight:true,
            },
            {
                type:'select',
                noDataText:'暂无数据',
                warning:'',
                disabled:false,
                value:'',
                placeholder:'请选择',
                options:[],
                style:{
                    marginLeft:'-4px',
                    width:'calc(100% + 4px)',
                },
                cutBorderLeft:true,
            },
            {
                type:'delete-icon',
                disabled:false,
                actionDisabled:false,
                style:{
                    marginTop:'6px',
                    fontSize:'20px',
                    // cursor:'not-allowed'
                },
            }
        ]
    }
];

