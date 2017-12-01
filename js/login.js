const Fblogin = document.getElementById('Fblogin');
Fblogin.addEventListener('click', FbSignIn,false);

function FbSignIn () {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    let self = this;
    //登入開始
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let token = result.credential.accessToken;
        //登入成功後設立使用者資料
        self.currentUserName = result.user.displayName;
        self.currentUserId = result.user.uid;
        //開啟畫面
        self.splash = !self.splash;
        // 使用者資訊
    })
    //登入結束
}