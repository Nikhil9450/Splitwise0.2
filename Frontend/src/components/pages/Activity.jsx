import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../redux/Activity/activitySlice';
import { useParams } from 'react-router-dom';

const Activity = () => {
  const dispatch = useDispatch();
  const { groupId: groupId } = useParams();
  const { activities, loading, error } = useSelector((state) => state.activity);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchActivities(groupId));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    console.log('groupId:', groupId);
    console.log('Activities updated:', activities);
  }, [activities, groupId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {activities?.length > 0 ? (
        activities.map((item, index) => (
          <div key={item._id || index}>
            <p style={{ fontWeight: 'bold',color:'white' }}>{item.action}</p>
          </div>
        ))
      ) : (
        !loading && <p style={{ fontWeight: 'bold',color:'white' }}>No activities found</p>
      )}
    </div>
  );
};

export default Activity;