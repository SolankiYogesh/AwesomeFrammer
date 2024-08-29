package com.awesomeframmer.Modules

import android.os.AsyncTask
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.awesomeframmer.Modules.Utilities.log
import com.awesomeframmer.Modules.Utilities.toast
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.MalformedURLException
import java.net.URL

class UpdateDownloader(private val mContext: ReactApplicationContext) :
    AsyncTask<String, Int, String?>() {

    private var lastValue: Int? = null
    private var isFetched: Boolean = false

    override fun doInBackground(vararg urls: String): String? {
        isFetched = false
        toast(mContext, "Downloading started")

        emit("Connecting", 1)
        val url = urls.firstOrNull() ?: return "No URL provided"

        return try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connect()

            val lengthOfFile = connection.contentLength
            val path = mContext.getExternalFilesDir(null)?.absolutePath ?: return "Failed to get external files directory"
            val file = File(path, "Update.apk")

            file.delete()
            FileOutputStream(file).use { fos ->
                connection.inputStream.use { inputStream ->
                    val buffer = ByteArray(1024)
                    var len: Int
                    var total: Long = 0
                    while (inputStream.read(buffer).also { len = it } != -1) {
                        total += len.toLong()
                        fos.write(buffer, 0, len)
                        publishProgress(((total * 100) / lengthOfFile).toInt())
                    }
                }
            }

            "Success"
        } catch (e: MalformedURLException) {
            log("MalformedURLException: ${e.message}")
            "MalformedURLException"
        } catch (e: IOException) {
            log("IOException: ${e.message}")
            "IOException"
        } catch (e: Exception) {
            log("Exception: ${e.message}")
            "Error"
        }
    }

    override fun onProgressUpdate(vararg values: Int?) {
        super.onProgressUpdate(*values)

        val currentValue = values.firstOrNull() ?: return
        if (currentValue != lastValue) {
            if (!isFetched && currentValue > 0) {
                emit("Connecting", 2)
                isFetched = true
            }
            emit("Progress", currentValue.toString())
            lastValue = currentValue
            log("Progress $currentValue")
        }
    }

    override fun onPostExecute(result: String?) {
        if (result == "Success") {
            emit("Success", true)
            toast(mContext, "Downloading Completed")
            val path = mContext.getExternalFilesDir(null)?.absolutePath
            val file = File(path, "Update.apk")
            UpdateProvider.installPackage(mContext,file)
        } else {
            emit("Error", false)
            toast(mContext, "Downloading Error Check Logs")
        }
        log("Result: $result")
        isFetched = false
        emit("Connecting", 3)
    }

    private fun emit(event: String, data: Any) {
        mContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(event, data)
    }

}
