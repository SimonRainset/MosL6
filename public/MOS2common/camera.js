function cameraSceneEnterExit(scene)
{
    if (scene.current === 'camerascene')  // entering camerascene : [mainscene] -> [camerascene]
        {
            cameraButton.visible = true;
            switchCameraButton.visible = true;
            hideCurrentInteractiveCharacter();
        }
    if (scene.last === 'camerascene')  // exiting camerascene:  [camerascene] -> [loadCutscene]
    {
        cameraButton.visible = false;
        switchCameraButton.visible = false;

    }   
}

//--------为了camera新加的--------
function takePhoto(localUrl='') {
    currentTime++;
    let dataUrl = '';
    if (localUrl!='')
    {
        capturedImg = loadImage(localUrl, img => {
            // 如果使用 p5.js >= 1.4.0，可以访问 img.canvas
            dataUrl = img.canvas.toDataURL('image/jpeg');
            console.log("dataUrl:"+dataUrl);
            fetch(dataUrl)
            .then(response => response.blob())
            .then(blob => {
                uploadPhoto(blob); // 调用上传函数
            })
            .catch(error => {
                console.error('Error converting image to blob:', error);
            });
        });
    }
    else{
        // 创建一个新的 p5.Image 对象
        capturedImg = createImage(capture.width, capture.height);
        capturedImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capturedImg.width, capturedImg.height);
        capturedImg.loadPixels(); // 加载像素数据
        bgImg = capturedImg;

        // 将 p5.Image 转换为 Data URL
        dataUrl = capturedImg.canvas.toDataURL('image/jpeg');

        // 将 Data URL 转换为 Blob 对象
        fetch(dataUrl)
            .then(response => response.blob())
            .then(blob => {
                uploadPhoto(blob); // 调用上传函数
            })
            .catch(error => {
                console.error('Error converting image to blob:', error);
            });
    }
    observeChangeOfGameStatus.notify({last:'camerascene',current:'loadCutscene'});
    gameStatus = 'loadCutscene';
    console.log("currentTime:" + currentTime)
}

//--------为了camera新加的--------
async function uploadPhoto(blob) {
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg'); // 将文件命名为 photo.jpg

    try {
        const uploadResponse = await fetch('https://morethanchat.club/server/update_photo', {
            method: 'POST',
            body: formData,
        });

        if (uploadResponse.ok) {
            const result = await uploadResponse.json(); // 解析 JSON 响应
            console.log('Photo uploaded successfully');
            console.log("Uploaded file URL:", result.url); // 打印文件路径
            cameraURL = result.url;
            closeCamera(); // 上传成功后关闭摄像头
        } else {
            const errorResult = await uploadResponse.json(); // 解析 JSON 错误信息
            console.error('Error uploading photo', errorResult);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

//--------为了camera新加的--------
function closeCamera() {
    if (capture) {
        capture.stop(); // 停止摄像头捕获
        capture = null; // 清除摄像头对象引用
    }
}

//--------为了camera新加的--------
function openCamera() {
    listCameras()
    if (getShootCount()>0)
    {
        if (capture) {
            capture.stop(); // 停止当前的摄像头捕获
        }
        capture = createCapture(VIDEO); // 创建摄像头捕获对象
        /*
                capture = createCapture(VIDEO, {
                    video: {
                        facingMode: { exact: "environment" } // "environment" 通常指的是后置摄像头
                    }
                });

         */

        capture.hide(); // 隐藏摄像头画面，因为我们将其绘制到 canvas 上

    }

}

function listCameras() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    console.log(`摄像头标签: ${device.label}, 设备ID: ${device.deviceId}`);
                }
            });
        })
        .catch(err => {
            console.error('枚举设备失败:', err);
        });
}

function switchCamera() {
    console.log("video input num:", videoInputs);
    if (videoInputs.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % videoInputs.length;
        capture.stop(); // 停止当前摄像头
        capture = createCapture(VIDEO, { video: { deviceId: { exact: videoInputs[currentCameraIndex].deviceId } } });
        capture.hide(); // 隐藏新摄像头画面
        capture.loop(); // 开始捕获新摄像头的画面
    }
}

function getShootCount()
{
    return shootCount;
}
function addShootCount(addcnt)
{
    shootCount+=addcnt;
    shootButton.innerText = `拍摄（剩余${shootCount}次）`
}
function setShootCount(cnt)
{
    shootCount = cnt;
    shootButton.innerText = `拍摄（剩余${shootCount}次）`
}
function getCurrentTime()
{
    return currentTime
}