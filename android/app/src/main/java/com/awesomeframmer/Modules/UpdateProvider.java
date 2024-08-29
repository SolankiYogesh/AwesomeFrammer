package com.awesomeframmer.Modules;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.awesomeframmer.BuildConfig;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


public class UpdateProvider {



    @SuppressLint("UnspecifiedImmutableFlag")
    public static void installPackage(ReactApplicationContext context, File file) throws IOException {


        // Check that file exists
        String Tag = "Update";

        if (!file.exists() || !file.isFile()) {
            Log.w(Tag, "File does not exist: " + file.getName());
            return;
        }

//        // Check that package is more recent than the current version
//        // https://stackoverflow.com/a/17118923
        PackageInfo newPackageInfo = context.getPackageManager().getPackageArchiveInfo(file.getAbsolutePath(), 0);
        Log.i("Update", "This package's version code: " + BuildConfig.VERSION_CODE);
        assert newPackageInfo != null;
        Log.i("Update", "New package's version code: " + newPackageInfo.versionCode);

        // PackageManager provides an instance of PackageInstaller
        PackageInstaller packageInstaller = context.getPackageManager().getPackageInstaller();

        // Prepare params for installing one APK file with MODE_FULL_INSTALL
        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        params.setAppPackageName(context.getPackageName());

        // Get a PackageInstaller.Session for performing the actual update
        int sessionId = packageInstaller.createSession(params);
        PackageInstaller.Session session = packageInstaller.openSession(sessionId);

        // Copy APK file bytes into OutputStream provided by install Session
        InputStream is = new FileInputStream(file);
        OutputStream os = session.openWrite(context.getPackageName(), 0, -1);
        byte[] buffer = new byte[65536];
        int length;
        while ((length = is.read(buffer)) != -1) {
            os.write(buffer, 0, length);
        }
        session.fsync(os);
        is.close();
        os.close();
        Log.i(Tag, "Installation complete");

        // The app gets killed after installation session commit
        Log.i(Tag, "Killing app");
        session.commit(PendingIntent.getBroadcast(context, sessionId, new Intent("android.intent.action.MAIN"), 0).getIntentSender());
    }
}
