<template>
    <div class="div" :class="black ? 'heiye' : 'baitian'">
        <div class="sun" @click="changeday"><van-icon name="closed-eye" /></div>
        <div class="top-banner">
            <p>三国杀语音小助手</p>
        </div>
        <div class="show">
            <div>
                <input type="text" v-model="userInput" placeholder="输入技能名（拼音）" @click="changstate"
                    @keyup.enter="searchSound">
                <button @click="searchSound">麦克风</button>
            </div>
            <div style="display: flex;align-items:first baseline;justify-content: space-around;width: 300px;">
                <div>

                    <van-switch v-model="checked" size="20px" @click="changeif" /><i style="color: aquamarine;">查看已添加</i>
                </div>
                <button @click="delete1">删除已添加</button>
            </div>
        </div>

        <div id="container" v-show="audioPlayers.length !== 0">

            <div id="audioOptions" class="button-group">
                <van-list>
                    <van-cell center :title="soundFilePath.split('/').pop().split('.').slice(0, -1).join('.')"
                        v-for="(soundFilePath, index) in soundFilePaths" :key="index">
                        <div class="numm">
                            <button @click="playSound(index)">
                                <van-icon name="volume-o" />
                            </button>
                            <button @click="add(soundFilePath)">+</button>
                        </div>
                    </van-cell>
                </van-list>
            </div>
            <p id="feedbackMessage" style="color: red;">{{ feedbackMessage }}</p>
        </div>
        <div>
            <div class="last">
                <van-cell @click="showPopup" style="border-radius: 20%;">感谢<van-icon name="star-o" /></van-cell>
                <van-popup v-model="show" position="bottom">在此特别感谢我们开发人员的辛苦付出：<br>
                    <a href="https://space.bilibili.com/13926662" target="_blank"
                        style="color:rgb(5, 173, 245);font-size: medium;">关注路人丁谢谢喵</a>
                        <br>
                    <a href="https://space.bilibili.com/227033285" target="_blank"
                        style="color:rgb(5, 173, 245);font-size: medium;">关注shuaiqideqiwang谢谢</a>
                </van-popup>
            </div>
            <!--             <div>
                <a href="https://space.bilibili.com/13926662" target="_blank"
                    style="color:rgb(5, 173, 245);font-size: medium;">关注路人丁喵，关注路人丁谢谢喵</a>
            </div>
            <br>
            <div>
                <a href="https://space.bilibili.com/227033285" target="_blank"
                    style="color:rgb(5, 173, 245);font-size: medium;">关注shuaiqideqiwang</a>
            </div> -->
        </div>
    </div>
</template>
<script>
import { getData } from '@/api/index'
export default {
    data() {
        return {
            userInput: '', // 用户输入的内容
            soundFilePaths: [], // 匹配的音频文件路径
            audioPlayer: null, // 当前的音频播放器
            audioPlayers: [], // 所有的音频播放器
            feedbackMessage: '', // 反馈消息
            black: false,
            list: [],
            loading: false,
            finished: false,
            saveData: [],
            checked: true,
            show: false
        }
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        delete1() {
            this.saveData = []
        },
        changstate() {
            this.checked = false
        },
        async changeif() {
            this.soundFilePaths = []; // 清空之前的音频文件路径
            if (this.audioPlayers) {
                // 这里是清空之前的音频文件，但是我们需要注意的是，我们增加的不能清除
                this.audioPlayers = []
            }
            // 假设文件路径为 'http://localhost:54128/skill/'，根据实际情况修改
            // const folderPath = 'http://localhost:54128/skill/';
            this.feedbackMessage = '';
            let soundExists = await this.checkSoundExists('/skill/');
            if (soundExists) {
                console.log(soundExists.data, 1);
                soundExists = soundExists.data
                let fileNames = soundExists.match(/p3([a-z0-9]{1,}\.m)/g); // 正则匹配获取所有 .mp3 文件名
                console.log(fileNames, 'fileNames');
                let newF = fileNames.map((item) => {
                    item = item.slice(2)
                    item = item.slice(0, item.length - 2)
                    return item
                })
                console.log(newF, 'fileNames2');
                if (newF) {
                    /*        this.soundFilePaths = []; // 清空之前的音频文件路径
                           if (this.audioPlayers) {
                               // 这里是清空之前的音频文件，但是我们需要注意的是，我们增加的不能清除
                               for (const audioPlayer of this.audioPlayers) {
                                   audioPlayer.pause();
                                   audioPlayer.src = '';
                               }
                           } */
                    // newF=this.saveData.concat(newF)
                    // console.log(this.saveData,'this.saveData');
                    // console.log(newF,'newF');
                    for (const fileName of newF) {
                        const cleanFileName = fileName.replace('.mp3"', '');
                        if (this.saveData.indexOf(cleanFileName) != -1) {
                            const soundFilePath = 'http://121.4.56.76:54128/skill/' + cleanFileName + '.mp3';
                            this.soundFilePaths.push(soundFilePath);
                            console.log(fileName);
                            const audioPlayer = new Audio();
                            // 就是根据src是否存在来判断是否保存
                            audioPlayer.src = soundFilePath;
                            this.audioPlayers.push(audioPlayer);
                        }
                    }
                    if (this.soundFilePaths.length === 0) {
                        this.feedbackMessage = '抱歉，没有找到相应的技能台词。';
                    }
                } else {
                    this.feedbackMessage = '抱歉，没有找到相应的音频片段。';
                }
            } else {
                this.feedbackMessage = '抱歉，无法获取音频文件列表。';
            }

        },
        add(soundFilePath) {
            // const soundFilePath = 'http://121.4.56.76:54128/skill/' + cleanFileName+'.mp3';
            // 这就是我们需要向数组里面push的东西
            soundFilePath = soundFilePath.replace('http://121.4.56.76:54128/skill/', '').replace('.mp3', '')
            console.log(soundFilePath);
            if (this.saveData.indexOf(soundFilePath) == -1) {
                this.$toast('添加成功');
                this.saveData.push(soundFilePath)
            }// 什么时候删除？
            else {
                this.$toast('请勿重复添加');
            }
        },
        changeday() {
            this.black = !this.black
        },
        async searchSound() {
            const userInput = this.userInput.trim().toLowerCase(); // 获取用户输入的内容并转换为小写
            this.soundFilePaths = []; // 清空之前的音频文件路径
            if (this.audioPlayers) {
                // 这里是清空之前的音频文件，但是我们需要注意的是，我们增加的不能清除
                this.audioPlayers = []
            }
            if (userInput !== '') {
                // 假设文件路径为 'http://localhost:54128/skill/'，根据实际情况修改
                // const folderPath = 'http://localhost:54128/skill/';
                this.feedbackMessage = '';

                let soundExists = await this.checkSoundExists('/skill/');
                if (soundExists) {
                    console.log(soundExists.data, 1);
                    soundExists = soundExists.data
                    let fileNames = soundExists.match(/p3([a-z0-9]{1,}\.m)/g); // 正则匹配获取所有 .mp3 文件名
                    console.log(fileNames, 'fileNames');
                    let newF = fileNames.map((item) => {
                        item = item.slice(2)
                        item = item.slice(0, item.length - 2)
                        return item
                    })
                    console.log(newF, 'fileNames2');
                    if (newF) {
                        /*        this.soundFilePaths = []; // 清空之前的音频文件路径
                               if (this.audioPlayers) {
                                   // 这里是清空之前的音频文件，但是我们需要注意的是，我们增加的不能清除
                                   for (const audioPlayer of this.audioPlayers) {
                                       audioPlayer.pause();
                                       audioPlayer.src = '';
                                   }
                               } */
                        // newF=this.saveData.concat(newF)
                        // console.log(this.saveData,'this.saveData');
                        // console.log(newF,'newF');
                        for (const fileName of newF) {
                            const cleanFileName = fileName.replace('.mp3"', '');
                            let userInput2 = RegExp(`^${userInput}`)
                            if (userInput2.test(cleanFileName) || this.saveData.indexOf(cleanFileName) != -1) {
                                const soundFilePath = 'http://121.4.56.76:54128/skill/' + cleanFileName + '.mp3';
                                this.soundFilePaths.push(soundFilePath);
                                console.log(fileName);
                                const audioPlayer = new Audio();
                                // 就是根据src是否存在来判断是否保存
                                audioPlayer.src = soundFilePath;
                                this.audioPlayers.push(audioPlayer);
                            }
                        }
                        if (this.soundFilePaths.length === 0) {
                            this.feedbackMessage = '抱歉，没有找到相应的技能台词。';
                        }
                    } else {
                        this.feedbackMessage = '抱歉，没有找到相应的音频片段。';
                    }
                } else {
                    this.feedbackMessage = '抱歉，无法获取音频文件列表。';
                }
            }
        },
        async checkSoundExists() {
            try {
                console.log('zhixingl')
                const response = await getData()
                return response;
            } catch (error) {
                return false;
            }
        },
        async playSound(index) {
            this.feedbackMessage = ''; // 清空之前的反馈消息
            if (this.audioPlayer) {
                this.audioPlayer.pause(); // 暂停之前的音频播放器
            }
            console.log(index);
            this.audioPlayer = this.audioPlayers[index]; // 获取当前的音频播放器
            console.log(this.audioPlayer);
            this.audioPlayer.play(); // 播放音频
        }
    }
}
</script>

<style lang="less">
.show {
    margin: 0 auto;
    display: flex;
    left: 50%-35px;
    text-align: center;
    width: fit-content;
    flex-direction: column;
}

.numm {
    display: flex;
}

.heiye {
    background-image: url('../assets/bbc.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
}

.sun {
    height: 50px;
    width: 50px;
    font-size: 30px;
    background-color: #636363;
    opacity: 0.5;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30%;
    position: absolute;
    top: 18px;
    left: 12px;
}

.van-cell--center {
    height: 40px;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f7f7f7;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    background-image: url('../assets/desktop-background.jpg');
    /* 添加背景图 */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* 
    我们加上动态class
    :class='black?heiye:baitian'
*/


/* 手机端的样式（使用不同的背景图片） */
@media (max-width: 768px) {
    .last{
        position: absolute;
        bottom: 2px;
        left: 5px;
        opacity: 0.6;
    }
    .show {
        display: flex;
        position: absolute;
        top: 25%;
        align-items: baseline;
        flex-wrap: wrap;
    }

    .baitian {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 100vh;
        /* 添加背景图 */
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('../assets/mobile-background.jpeg');
    }

    .heiye {
        font-family: Arial, sans-serif;
        background-color: #686161;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 100vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('../assets/back.jpg');
    }

    #container {
        position: absolute;
        opacity: 0.8;
        width: 60vw;
        max-height: 400px;
        overflow: scroll;
        margin: 0 auto;
        top: 40%;
        margin: 0 auto;
    }


    .top-banner {
        position: absolute;
        top: 60px;
        left: 70%-55px;
        font-size: xx-large;
        text-align: center;
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.1);
        color: rgb(121, 85, 85);
        /* 更低调的颜色 */
        line-height: 1.2;
        transition: background-color 0.3s ease;
    }


}

#container {
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    /* 添加半透明白色背景 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    /* 添加阴影 */
}

input[type="text"] {
    padding: 10px;
    width: 180px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 10px;
}

button {
    margin: 10px;
    padding: 6px 15px;
    font-size: 14px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    /* 添加按钮动画 */
}

button:hover {
    background-color: #0056b3;
    /* 鼠标悬停时变色 */
}

/* 根据用户输入内容生成的按钮样式 */
.button-group button {
    margin: 5px;
    background-color: #ffffff;
    color: #333;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-group button:hover {
    background-color: #ccc;
}

audio {
    width: 100%;
    margin-top: 20px;
}

.top-banner {
    top: 50px;
    font-size: xx-large;
    text-align: center;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgb(121, 85, 85);
    /* 更低调的颜色 */
    line-height: 1.5;
    transition: background-color 0.3s ease;
}

.top-banner:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
