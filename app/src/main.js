const Editor = require('./editor');

const Vue = require('vue');

const axios = require('axios');

const UIkit = require('uikit')
window.editor = new Editor;

// windows.vue нужно для глобализации методов пользовательского интерфейса
window.vue = new Vue({
    el: '#app',
    data: {
        showLoader:true,
        pageList: [],
        page: "index.html",
        backupList: [],
        meta: {
            title: "", description: "", keywords: ""
        },
        auth: false,
        password: "",
        loginError: false
    },
    methods:{
        onBtnSave(){
            this.showLoader = true;
            window.editor.save(
                () => {
                    this.loadBackupList();
                    this.showLoader = false;
                    UIkit.notification({message: 'Успешно сохранено!', status: 'success'}),
                    () => {
                    this.showLoader = false;
                    UIkit.notification({message: 'Ошибка сохранения', status: 'danger'})
                    }
            })
        },
        openPage(page){
            this.page = page;
            this.loadBackupList();
            this.showLoader = true;
            window.editor.open(page, () => {
                this.showLoader = false;
                this.meta = window.editor.metaEditor.getMeta();
            });
        },

        loadBackupList(){
            axios
                .get("./backups/backups.json")
                .then((res) => {
                    this.backupList = res.data.filter((backup) => {
                        return (backup.page === this.page);
                    })
                });
        },

        restoreBackup(backup){
            UIkit.modal.confirm('Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные данные будут утеряны!.',
                { labels: {ok: "Восстановить", cancel: "Отмена"} }
                )
                .then(() => {
                    this.showLoader = true;
                    return axios.post('./api/restoreBackup.php', { "page": this.page, "file": backup.file })
                })
                .then(() => {
                    this.openPage(this.page);
                })

        },

        applyMeta(){
            this.meta = window.editor.metaEditor.setMeta(this.meta.title, this.meta.description, this.meta.keywords);
        },

        enableLoader(){
            this.showLoader = true;
        },

        disableLoader(){
            this.showLoader = false;
        },

        errorNotification(message){
            UIkit.notification({message: message, status: 'danger'});
        },

        login(){
            if (this.password.length > 5){
                axios
                    .post('./api/login.php', {"password": this.password})
                    .then((res) => {
                        if (res.data.auth === true){
                            this.auth = true;
                            this.start();
                        }
                        else{
                            this.loginError = true;
                        }
                    })
            } else {
                this.loginError = true;
            }
        },

        logout(){
            axios
                .get("./api/logout.php")
                .then(() => {
                   window.location.replace("/");
                });
        },

        start(){
            this.openPage(this.page);
            axios
                .get('./api/pageList.php')
                .then((res) => {
                    this.pageList = res.data;
                });
            this.loadBackupList();
        },

    },
    created() {
        axios
            .get("./api/checkAuth.php")
            .then((res) => {
                console.log(res.data);
                if (res.data.auth === true){
                    this.auth = true;
                    this.start();
                }
            });
    },
})