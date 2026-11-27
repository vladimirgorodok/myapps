package ru.myapps.myapps;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "InstalledApps")
public class InstalledAppsPlugin extends Plugin {

    @PluginMethod
    public void getVersions(PluginCall call) {
        JSArray packages = call.getArray("packages");
        PackageManager pm = getContext().getPackageManager();
        JSObject result = new JSObject();
        if (packages == null) {
            call.resolve(result);
            return;
        }
        for (int i = 0; i < packages.length(); i++) {
            try {
                String pkg = packages.getString(i);
                try {
                    PackageInfo info = pm.getPackageInfo(pkg, 0);
                    result.put(pkg, info.versionName == null ? "" : info.versionName);
                } catch (PackageManager.NameNotFoundException e) {
                    result.put(pkg, JSONObject.NULL);
                }
            } catch (JSONException e) {
                call.reject("Некорректный список пакетов");
                return;
            }
        }
        call.resolve(result);
    }
}
