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
